FROM node:lts

WORKDIR /

COPY package*.json ./
COPY /src ./

RUN npm install express
RUN npm install dotenv
RUN npm install path

ENV PORT=9000

COPY . .

EXPOSE 9000

CMD [ "npm", "start" ]
