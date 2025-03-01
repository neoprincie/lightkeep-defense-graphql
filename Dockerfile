FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npx prisma generate 
RUN npx prisma migrate deploy 
RUN npx prisma db seed

RUN npm run compile

EXPOSE 8080

CMD ["node", "./dist/src/index.js"]