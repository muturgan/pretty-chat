// import Promise from 'bluebird';
// global.Promise = Promise;

import express from 'express';
import socketIO from 'socket.io';
import path = require('path');
import http = require('http');
import controller from './controller';
import printTime from './print-time';

const app = express()
  .use(express.static( path.join(__dirname, '../static') ))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
  .get('/sign-in', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
  .get('/sign-up', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
  .get('/chat', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); });

const server = new http.Server(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`
${printTime()} server listening on ${ PORT }`);
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log(``);
  console.log(`${printTime()} connected new client ${socket.id}`);


    socket.on('initSignIn', async (data: {name: string, password: string}) => {
        try {
            const result = await controller.initSignIn(data);
            socket.emit('signInSuccess', result);
            connectedUsers[result.name] = socket.id;
            socket.broadcast.emit('user connected', result.name);

            console.log('');
            console.log(`${printTime()} ${result.name} is online`);
        } catch (error) {
            if (error.message === 'signInError') {
                socket.emit('signInError');
            } else {
                console.log('');
                console.log(`${printTime()} error:`);
                console.error(error);
                socket.emit('serverError');
            }
        }
    });


    socket.on('initSignUp', async (data: {name: string, password: string}) => {
      try {
          const result = await controller.initSignUp(data);
          socket.emit('signUpSuccess', result);
          connectedUsers[result.name] = socket.id;
          socket.broadcast.emit('user created', result.name);

          console.log('');
          console.log(`${printTime()} new user ${result.name} joined`);
      } catch (error) {
          if (error.message === 'signUpError') {
              socket.emit('signUpError');
          } else {
              console.log('');
              console.log(`${printTime()} error:`);
              console.error(error);
              socket.emit('serverError');
          }
      }
    });


    socket.on('initChat', async () => {
      try {
          const result = await controller.initChat();
          socket.emit('initChatResponse', result);
      } catch (error) {
          console.log('');
          console.log(`${printTime()} error:`);
          console.error(error);
          socket.emit('serverError');
      }
    });


    socket.on('messageFromClient', async (message: {text: string, author_id: number}) => {
      try {
          const result = await controller.messageFromClient(message);
          io.emit('messageFromServer', result);
      } catch (error) {
          console.log('');
          console.log(`${printTime()} error:`);
          console.error(error);
          socket.emit('serverError');
      }
    });


    socket.on('user leave', async (user: {id: number, name: string, status: string}) => {
      if (user.name !== 'default') {
        try {
            await controller.userLeave(user);
            console.log(``);
            console.log(`${printTime()} ${user.name} is offline`);
            delete connectedUsers[user.name];
            io.emit('user leave', user.name);
        } catch (error) {
            console.log('');
            console.log(`${printTime()} error:`);
            console.error(error);
        }
      }
    });

});
