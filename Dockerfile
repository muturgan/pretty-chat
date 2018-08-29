FROM node:alpine
COPY package*.json ./
RUN npm install --only=production
COPY dist/* ./
EXPOSE 3333
CMD [ "node", "server.js" ]