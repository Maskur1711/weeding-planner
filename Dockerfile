FROM node:22-alpine

WORKDIR /app

# Install dependencies (termasuk devDependencies agar tsx bisa berjalan)
COPY package*.json ./
RUN npm install

# Copy Prisma schema & generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy semua source code
COPY . .

# Buat folder auth_info
RUN mkdir -p /app/auth_info

# Jalankan bot
CMD ["npm", "run", "start:bot"]
