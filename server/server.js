const express = require('express');
const path = require('path');
const app = express()
  .use(express.static( path.join(__dirname, '../static') ))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => {res.sendFile( path.join(__dirname, '/../static/index.html') )});


const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3333;

const controller = require('./controller.js');
const printTime = require('./print-time.js');

http.listen(PORT, () => {
  console.log(`
${printTime()} server listening on ${ PORT }`);
});


const connectedUsers = {};

io.on('connection', (socket) => {
  console.log(``);
  console.log(`${printTime()} connected new client ${socket.id}`);
  
  
    socket.on('initSignIn', (data) => {
      controller.initSignIn(data)
        .then((result) => {
          socket.emit('signInSuccess', result);
          connectedUsers[result.name] = socket.id;
          socket.broadcast.emit('user connected', result.name);
          
          console.log('');
          console.log(`${printTime()} ${result.name} is online`);   
        }).catch((error) => {
          if (error.message === 'signInError') {
            socket.emit('signInError');
          } else {
            console.log('');
            console.log(`${printTime()} error:`);
            console.log(error);
            socket.emit('serverError');
          }
        });
    });
    
    
    socket.on('initSignUp', (data) => {
      controller.initSignUp(data)
        .then((result) => {
          socket.emit('signUpSuccess', result);
          connectedUsers[result.name] = socket.id;
          socket.broadcast.emit('user created', result.name);
          
          console.log('');
          console.log(`${printTime()} new user ${result.name} joined`);
        }).catch((error) => {
          if (error.message === 'signUpError') {
            socket.emit('signUpError');
          } else {
            console.log('');
            console.log(`${printTime()} error:`);
            console.log(error);
            socket.emit('serverError');
          }
        });
    });
    
    
    socket.on('initChat', () => {
      controller.initChat()
        .then((result) => {
          socket.emit('initChatResponse', result);
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
  
   
   
    socket.on('messageFromClient', (message) => {
      controller.messageFromClient(message)
        .then((result) => {
          io.emit('messageFromServer', result);
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
    
    socket.on('user leave', (user) => {
      if (user.name !== 'default') {
        controller.userLeave(user)
          .then(() => {
            console.log(``);
            console.log(`${printTime()} ${user.name} is offline`);
            delete connectedUsers[user.name];
            io.emit('user leave', user.name);
          }).catch((error) => {
            console.log('');
            console.log(`${printTime()} error:`);
            console.log(error);
          });
      }
    });
     
});