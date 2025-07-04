FROM node:18-alpine

WORKDIR /app          # <- Tudo que vem depois acontece aqui dentro

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3051
CMD ["npm", "start"]
