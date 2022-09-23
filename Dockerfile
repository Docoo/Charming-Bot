FROM node:16
LABEL authors="Docoo"
COPY . .
RUN apt-get update && apt-get install -y php && rm -rf /var/lib/apt/lists/*
RUN npm install
CMD [ "node", "bot.js" ]