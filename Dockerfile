FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3333
CMD [ "node", "server/server.js" ]