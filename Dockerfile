FROM node:16
LABEL authors="Docoo"
COPY . .
RUN apt-get install php
RUN npm install
CMD [ "node", "bot.js" ]