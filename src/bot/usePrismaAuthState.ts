import {
  initAuthCreds,
  BufferJSON,
  AuthenticationState,
  AuthenticationCreds,
  SignalDataTypeMap,
  proto
} from "@whiskeysockets/baileys";
import { prisma } from "../lib/db";

export const usePrismaAuthState = async (): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
  // Read existing credentials from DB
  const credsRecord = await prisma.authState.findUnique({
    where: { id: "creds" },
  });

  let creds: AuthenticationCreds;
  if (credsRecord && credsRecord.value) {
    creds = JSON.parse(credsRecord.value, BufferJSON.reviver);
  } else {
    creds = initAuthCreds();
  }

  const saveCreds = async () => {
    const value = JSON.stringify(creds, BufferJSON.replacer);
    await prisma.authState.upsert({
      where: { id: "creds" },
      create: { id: "creds", value },
      update: { value },
    });
  };

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [id: string]: any } = {};
          await Promise.all(
            ids.map(async (id) => {
              const record = await prisma.authState.findUnique({
                where: { id: `${type}-${id}` },
              });
              let value = record && record.value ? JSON.parse(record.value, BufferJSON.reviver) : null;
              
              if (type === "app-state-sync-key" && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks: Promise<any>[] = [];
          for (const category of Object.keys(data)) {
            const catData = data[category as keyof SignalDataTypeMap];
            if (!catData) continue;
            
            for (const id of Object.keys(catData)) {
              const value = catData[id];
              const keyId = `${category}-${id}`;
              if (value) {
                const strValue = JSON.stringify(value, BufferJSON.replacer);
                tasks.push(
                  prisma.authState.upsert({
                    where: { id: keyId },
                    create: { id: keyId, value: strValue },
                    update: { value: strValue },
                  })
                );
              } else {
                tasks.push(
                  prisma.authState.delete({ where: { id: keyId } }).catch(() => {})
                );
              }
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveCreds,
  };
};
