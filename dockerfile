FROM node:20-alpine

# 1️⃣ working directory
WORKDIR /app

# 2️⃣ copy package files
COPY package*.json ./

# 3️⃣ install dependencies
RUN npm install

# 4️⃣ copy source code
COPY . .

# 5️⃣ build Next.js
RUN npm run build

# 6️⃣ expose web port
EXPOSE 3000

# 7️⃣ start production server
CMD ["npm", "start"]
