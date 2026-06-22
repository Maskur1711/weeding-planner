FROM node:22-alpine

WORKDIR /app

# Install dependencies (termasuk devDependencies agar tsx bisa berjalan)
COPY package*.json ./

# Copy Prisma schema terlebih dahulu agar postinstall "prisma generate" bisa berjalan
COPY prisma ./prisma

RUN npm install

# Copy semua source code
COPY . .

# Buat folder auth_info
RUN mkdir -p /app/auth_info

# Jalankan bot
CMD ["npm", "run", "start:bot"]
