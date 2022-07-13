FROM node:16
LABEL authors="Docoo"
COPY . .
RUN npm install
CMD [ "node", "bot.js" ]