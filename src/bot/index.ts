import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import type { WAMessage, ConnectionState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";
import express from "express";
import { prisma } from "../lib/db";
import { parseExpenseMessage } from "../lib/parser";
import { formatRupiah, formatDate } from "../lib/format";

// ---------------------------------------------------------------------------
// Config dari env
// ---------------------------------------------------------------------------
const AUTH_FOLDER = process.env.AUTH_FOLDER || "./auth_info";
const ALLOWED_SENDERS = process.env.ALLOWED_SENDERS
  ? process.env.ALLOWED_SENDERS.split(",").map((s) => s.trim())
  : [];

// ---------------------------------------------------------------------------
// Logger
// ---------------------------------------------------------------------------
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: { target: "pino-pretty", options: { colorize: true } },
});

// ---------------------------------------------------------------------------
// Helper: cek apakah pengirim diizinkan
// ---------------------------------------------------------------------------
function isSenderAllowed(jid: string): boolean {
  if (ALLOWED_SENDERS.length === 0) return true;
  const number = jid.replace(/@\S+$/, ""); // "62812345678"
  return ALLOWED_SENDERS.some(
    (allowed) => number === allowed || number.endsWith(allowed)
  );
}

// ---------------------------------------------------------------------------
// Helper: ambil teks dari pesan WA
// ---------------------------------------------------------------------------
function extractText(msg: WAMessage): string | null {
  const message = msg.message;
  if (!message) return null;

  // Pesan teks biasa
  if ("conversation" in message && typeof message.conversation === "string") {
    return message.conversation;
  }

  // Pesan teks panjang / extended text
  if (
    "extendedTextMessage" in message &&
    message.extendedTextMessage &&
    "text" in message.extendedTextMessage &&
    typeof message.extendedTextMessage.text === "string"
  ) {
    return message.extendedTextMessage.text;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Helper: cek apakah pesan relevan (bukan dari sendiri / status broadcast)
// ---------------------------------------------------------------------------
function isRelevant(jid: string, msg: WAMessage): boolean {
  if (msg.key.fromMe) return false;
  if (jid === "status@broadcast") return false;
  return true;
}

// ---------------------------------------------------------------------------
// Main — start Baileys socket
// ---------------------------------------------------------------------------
async function main() {
  logger.info(`🔓 Auth folder: ${AUTH_FOLDER}`);

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

  const { version } = await fetchLatestBaileysVersion();
  logger.info(`📱 Baileys version: ${version}`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state, // Baileys v7: langsung AuthenticationState
  });

  // Simpan credential setiap ada update
  sock.ev.on("creds.update", saveCreds);

  // Handle koneksi (QR, reconnect, logout)
  sock.ev.on("connection.update", (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      globalQrString = qr;
      qrcode.generate(qr, { small: true });
      logger.info("📷 Buka URL aplikasi web ini di browser untuk melihat QR Code yang rapi!");
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      logger.warn(
        `🔌 Koneksi tertutup. Reconnect: ${shouldReconnect} | Reason: ${statusCode}`
      );
      if (shouldReconnect) {
        main();
      } else {
        logger.error(
          "❌ Akun logged out. Hapus folder auth dan scan ulang QR."
        );
        process.exit(1);
      }
    }

    if (connection === "open") {
      logger.info("✅ WhatsApp terhubung! Bot aktif, menunggu pesan...");
    }
  });

  // Handler pesan masuk
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      const jid = msg.key.remoteJid!;

      if (!isRelevant(jid, msg)) continue;

      // Kirim typing indicator
      await sock.sendPresenceUpdate("composing", jid);

      const text = extractText(msg);

      if (!text || text.trim().length === 0) continue;

      logger.info(`📩 Pesan dari ${jid}: "${text}"`);

      // Cek whitelist
      if (!isSenderAllowed(jid)) {
        await sock.sendMessage(jid, {
          text: "⚠️ Maaf, nomor Anda tidak terdaftar untuk input transaksi.",
        });
        continue;
      }

      // Parse
      const parsed = parseExpenseMessage(text);

      if (!parsed) {
        await sock.sendMessage(jid, {
          text: `❌ Format salah.\n\nContoh yang benar:\nAlat solat total 203.000\nKatering total 15.000.000\n\nPastikan format: <nama> total <angka>`,
        });
        continue;
      }

      // Simpan ke database
      try {
        const saved = await prisma.transaction.create({
          data: {
            nama: parsed.nama,
            jumlah: parsed.jumlah,
            kategori: parsed.kategori,
            senderJid: jid,
          },
        });

        logger.info(
          `💾 Tersimpan [${saved.id}]: ${saved.nama} — ${formatRupiah(saved.jumlah)} (${saved.kategori})`
        );

        await sock.sendMessage(jid, {
          text: `✅ *Tersimpan!*\n\n📦 ${saved.nama}\n💰 ${formatRupiah(saved.jumlah)}\n📂 ${saved.kategori}\n🕐 ${formatDate(saved.createdAt)}`,
        });
      } catch (err) {
        logger.error({ err }, "❌ Gagal simpan ke database");
        await sock.sendMessage(jid, {
          text: "❌ Gagal menyimpan data. Coba lagi nanti.",
        });
      }
    }
  });
}

let globalQrString = "";

main().catch((err) => {
  logger.error({ err }, "💥 Fatal error di bot");
  process.exit(1);
});

// Render Web Service requires binding to a PORT
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  if (globalQrString) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan QR Bot</title>
        <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f0f2f5; }
          .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
          #qr { margin: 20px auto; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Scan QR Code untuk Bot WhatsApp</h2>
          <p>Buka WhatsApp > Tautkan Perangkat > Arahkan kamera ke QR ini.</p>
          <div id="qr"></div>
          <p><small>Jika QR sudah di-scan, refresh halaman ini.</small></p>
        </div>
        <script>
          var qr = qrcode(0, 'L');
          qr.addData('${globalQrString}');
          qr.make();
          document.getElementById('qr').innerHTML = qr.createImgTag(5, 0);
        </script>
      </body>
      </html>
    `);
  } else {
    res.send("Bot sedang berjalan dan terhubung ke WhatsApp, atau sedang loading.");
  }
});

app.listen(PORT, () => {
  logger.info(`🌐 Web interface berjalan di port ${PORT}`);
});
