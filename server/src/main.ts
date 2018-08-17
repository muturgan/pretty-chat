import Bluebird from 'bluebird';
global.Promise = Bluebird;

import express from 'express';
import socketIO from 'socket.io';
import path = require('path');
import http = require('http');
import Controller from './controller';
import { logger, errorString } from './logger';
import { messageType, userInfoType } from './types';

const controller = new Controller;

const app = express()
    .use(express.static( path.join(__dirname, '../static') ))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .get('/', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
    .get('/sign-in', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
    .get('/sign-up', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
    .get('/chat', (req, res) => { res.sendFile( path.join(__dirname, '/../static/index.html') ); })
    .get('/getLogs', (req, res) => {
        logger.info(`logs were sent to ${ req.url }`);
        res.sendFile( path.join(__dirname, '/../combined.log') );
    });

const server = new http.Server(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
    logger.info(`server listening on ${ PORT }`);
});

const connectedUsers = {};

io.on('connection', (socket) => {
    logger.info(`connected new client ${socket.id}`);

    socket.on('initSignIn', async (data: {name: string, password: string}) => {
        try {
            const result: userInfoType = await controller.initSignIn(data);
            socket.emit('signInSuccess', result);
            connectedUsers[result.name] = socket.id;
            socket.broadcast.emit('user connected', result.name);

            logger.info(`${result.name} is online`);
        } catch (error) {
            if (error.message === 'signInError') {
                socket.emit('signInError');
            } else {
                logger.error(errorString(error));
                socket.emit('serverError');
            }
        }
    });


    socket.on('initSignUp', async (data: {name: string, password: string}) => {
        try {
            const result: userInfoType = await controller.initSignUp(data);
            socket.emit('signUpSuccess', result);
            connectedUsers[result.name] = socket.id;
            socket.broadcast.emit('user created', result.name);

            logger.info(`new user ${result.name} joined`);
        } catch (error) {
            if (error.message === 'signUpError') {
                socket.emit('signUpError');
            } else {
                logger.error(errorString(error));
                socket.emit('serverError');
            }
        }
    });


    socket.on('initChat', async () => {
      try {
            const result: Array<messageType> = await controller.initChat();
            socket.emit('initChatResponse', result);
      } catch (error) {
            logger.error(errorString(error));
            socket.emit('serverError');
      }
    });


    socket.on('messageFromClient', async (message: {text: string, author_id: number}) => {
        try {
            const result: messageType = await controller.messageFromClient(message);
            io.emit('messageFromServer', result);
        } catch (error) {
            logger.error(errorString(error));
            socket.emit('serverError');
        }
    });


    socket.on('user leave', async (user: userInfoType) => {
      if (user.name !== 'default') {
        try {
            await controller.userLeave(user.id);
            logger.info(`${user.name} is offline`);
            delete connectedUsers[user.name];
            io.emit('user leave', user.name);
        } catch (error) {
            logger.error(errorString(error));
        }
      }
    });

});
