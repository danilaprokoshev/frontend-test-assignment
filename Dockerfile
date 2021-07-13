FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5100

EXPOSE 5100

CMD [ "make", "start" ]


