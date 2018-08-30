FROM node:alpine
WORKDIR /server
COPY package*.json ./
RUN npm install --only=production
COPY dist /server
EXPOSE 3333
CMD [ "node", "server.js" ]

# docker build -t <title> .
# docker images
# docker run ?--rm -it? -p 8080:3333 -d <title>
# docker ps
# docker stop <id>
# docker run -it <title> sh - посмотреть что внутри
# exit