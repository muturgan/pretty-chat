// https://pretty-chat.herokuapp.com/
//git@heroku.com:pretty-chat.git

const express = require('express');
const app = express()
  .use(express.static('static'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => {res.sendFile(__dirname + '/static/page.html')});


const http = require('http').Server(app);

//const io = require('socket.io').listen(3333).sockets;
const io = require('socket.io')(http);

const PORT = process.env.PORT || 2222;
//const PORT = 'www.pretty-chat.ru/';

const mysql = require('promise-mysql');
const mysqlConfig = {
  host: '128.199.39.117',
  user: 'node',
  password: 'edon',
  database: 'pretty_chat',
  port: 3306,
};

const printTime = require('./print-time.js');

http.listen(PORT, () => {
  console.log(`
${printTime()} server listening on ${ PORT }`);
});


const connectedUsers = {};

io.on('connection', (socket) => {
  console.log(``);
  console.log(`${printTime()} connected new client ${socket.id}`);
  
    socket.on('query', (clientQuery) => {
      console.log(``);
      console.log(`${printTime()} query to mysql database: ${clientQuery}`);
      
      mysql.createConnection(mysqlConfig)
        .then((conn) => {
          let result = conn.query(clientQuery);
          conn.end();
          return result;
        }).then((rows) => {
          console.log('');
          console.log(`${printTime()} result:`);
          console.log(rows);
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          });
    });
    
    
    socket.on('initSignIn', (data) => {
      mysql.createConnection(mysqlConfig)
        .then((conn) => {
          let result = conn.query(`SELECT password FROM users WHERE name="${ data.name }";`);
          conn.end();
          return result;
        }).then((rows) => {
          if ((rows[0] === undefined) || (rows[0].password !== data.password)) {
            socket.emit('signInError');
          } else {
            let connection;
            mysql.createConnection(mysqlConfig)
              .then((conn) => {
                connection = conn;
                return connection.query(`UPDATE users SET status = 'online' WHERE name="${ data.name }";`);
              }).then(() => {
                let result = connection.query(`SELECT id, name, status FROM users WHERE name="${ data.name }"`);
                connection.end();
                return result;
              }).then((rows) => {
                console.log('');
                console.log(`${printTime()} signInSuccess:`);
                console.log(rows[0]);
                
                socket.emit('signInSuccess', rows[0]);
                connectedUsers[rows[0].name] = socket.id;
                socket.broadcast.emit('user connected', rows[0].name);

                console.log('');
                console.log(`${printTime()} ${rows[0].name} is online`);
              }).catch((error) => {
                console.log('');
                console.log(`${printTime()} error:`);
                console.log(error);
                socket.emit('serverError');
              });
          }
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
    
    socket.on('initSignUp', (data) => {
      mysql.createConnection(mysqlConfig)
        .then((conn) => {
          let result = conn.query(`SELECT name FROM users WHERE name="${ data.name }";`);
          conn.end();
          return result;
        }).then((rows) => {
          if (rows[0]) {
            socket.emit('signUpError');
          } else {
            let connection;
            mysql.createConnection(mysqlConfig)
              .then((conn) => {
                connection = conn;
                return connection.query(`INSERT INTO users (name, password, status) VALUES ('${ data.name }', '${ data.password }', 'online');`);
              }).then(() => {
                let result = connection.query(`SELECT id, name, status FROM users WHERE name="${ data.name }"`);
                connection.end();
                return result;
              }).then((rows) => {
                socket.emit('signUpSuccess', rows[0]);
                connectedUsers[rows[0].name] = socket.id;
                
                console.log('');
                console.log(`${printTime()} new user ${rows[0].name} joined`);
              }).catch((error) => {
                console.log('');
                console.log(`${printTime()} error:`);
                console.log(error);
                socket.emit('serverError');
              });
          }
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
    
    socket.on('initChat', () => {
      mysql.createConnection(mysqlConfig)
        .then((conn) => {
          let result = conn.query(`SELECT *, NULL AS password FROM users, messages WHERE messages.author_id = users.id AND messages.room="public";`);
          conn.end();
          return result;
        }).then((rows) => {
          console.log('');
          console.log(`${printTime()} initChat response:`);
          console.log(rows);
          socket.emit('initChatResponse', rows);
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
  
   
   
    socket.on('messageFromClient', (message) => {
      let connection;
      let now = Date.now();

      mysql.createConnection(mysqlConfig)
        .then((conn) => {
          connection = conn;
          return connection.query(`INSERT INTO messages (date, text, author_id) VALUES (${now},'${message.text}', '${message.author_id}');`);
        }).then((rows) => {
          let result = connection.query(`SELECT *, NULL AS password FROM users, messages WHERE users.id = ${message.author_id} AND messages.room="public" AND messages.date=${now} AND messages.text="${message.text}";`);
          connection.end();
          return result;
        }).then((rows) => {
          console.log('');
          console.log(`${printTime()} messageFromServer:`);
          console.log(rows[0]);
          io.emit('messageFromServer', rows[0]);
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
    socket.on('user disconnected', (user) => {
      if (user.name !== 'default') {
        let connection;
        mysql.createConnection(mysqlConfig)
          .then((conn) => {
            connection = conn;
            return connection.query(`UPDATE users SET status = 'offline' WHERE id="${ user.id }";`);
          }).then(() => {
            connection.end();
            console.log(``);
            console.log(`${printTime()} ${user.name} is offline`);
            delete connectedUsers[user.name];
            io.emit('user leave', user.name);
          }).catch((error) => {
            connection.end();
            console.log('');
            console.log(`${printTime()} error:`);
            console.log(error);
          });
      }
    });
     
});