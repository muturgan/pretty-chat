// https://pretty-chat.herokuapp.com/
// git@heroku.com:pretty-chat.git

const express = require('express');
const path = require('path');
const app = express()
  .use(express.static( path.join(__dirname, '../static') ))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => {res.sendFile( path.join(__dirname, '/../static/index.html') )});


const http = require('http').Server(app);

//const io = require('socket.io').listen(3333).sockets;
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3333;

const mysql = require('promise-mysql');
const mysqlConfig = {
  host: '128.199.39.117',
  user: 'node',
  password: 'edon',
  database: 'pretty_chat',
  port: 3306,
};

const Base64 = require('js-base64').Base64;

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
      mysql.createConnection(mysqlConfig)
        .then((conn) => {
          let result = conn.query(`SELECT password FROM users WHERE name="${ Base64.encode(data.name) }";`);
          conn.end();
          return result;
        }).then((rows) => {
          if ((rows[0] === undefined) || (Base64.decode(rows[0].password) !== data.password)) {
            socket.emit('signInError');
          } else {
            let connection;
            mysql.createConnection(mysqlConfig)
              .then((conn) => {
                connection = conn;
                return connection.query(`UPDATE users SET status = 'online' WHERE name="${ Base64.encode(data.name) }";`);
              }).then(() => {
                let result = connection.query(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
                connection.end();
                return result;
              }).then((rows) => {
                rows[0].name = Base64.decode(rows[0].name);
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
          let result = conn.query(`SELECT name FROM users WHERE name="${ Base64.encode(data.name) }";`);
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
                return connection.query(`INSERT INTO users (name, password, status) VALUES ('${ Base64.encode(data.name) }', '${ Base64.encode(data.password) }', 'online');`);
              }).then(() => {
                let result = connection.query(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
                connection.end();
                return result;
              }).then((rows) => {
                rows[0].name = Base64.decode(rows[0].name);
                socket.emit('signUpSuccess', rows[0]);
                connectedUsers[rows[0].name] = socket.id;
                socket.broadcast.emit('user created', rows[0].name);
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
          for (let row of rows) {
            row.name = Base64.decode(row.name);
            row.text = Base64.decode(row.text);
          }
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
          return connection.query(`INSERT INTO messages (date, text, author_id) VALUES (${now},'${Base64.encode(message.text)}', '${message.author_id}');`);
        }).then((rows) => {
          let result = connection.query(`SELECT *, NULL AS password FROM users, messages WHERE users.id = ${message.author_id} AND messages.room="public" AND messages.date=${now} AND messages.text="${Base64.encode(message.text)}";`);
          connection.end();
          return result;
        }).then((rows) => {
          rows[0].name = Base64.decode(rows[0].name);
          rows[0].text = Base64.decode(rows[0].text);
          io.emit('messageFromServer', rows[0]);
        }).catch((error) => {
          console.log('');
          console.log(`${printTime()} error:`);
          console.log(error);
          socket.emit('serverError');
        });
    });
    
    socket.on('user leave', (user) => {
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