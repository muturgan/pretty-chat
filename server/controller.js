const sqlRequest = require('./db.js');

const Base64 = require('js-base64').Base64;

const controller = {
  initSignIn: (data) => {
    return sqlRequest(`SELECT password FROM users WHERE name="${ Base64.encode(data.name) }";`)
      .then((rows) => {
        if ((rows[0] === undefined) || (Base64.decode(rows[0].password) !== data.password)) {
          return 'signInError'; //return new Error('signInError');
        } else {
          return sqlRequest(`UPDATE users SET status = 'online' WHERE name="${ Base64.encode(data.name) }";`)
          .then(() => {
            return sqlRequest(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
          }).then((rows) => {
            rows[0].name = Base64.decode(rows[0].name);
            return rows[0];
          });
        }
      }).catch((error) => {
        throw new Error(error); //return error;
      });
  },
  
  initSignUp: (data) => {
    return sqlRequest(`SELECT name FROM users WHERE name="${ Base64.encode(data.name) }";`)
      .then((rows) => {
        if (rows[0]) {
          return 'signUpError'; //return new Error('signUpError');
        } else {
          return sqlRequest(`INSERT INTO users (name, password, status) VALUES ('${ Base64.encode(data.name) }', '${ Base64.encode(data.password) }', 'online');`)
          .then(() => {
            return sqlRequest(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
          }).then((rows) => {
            return rows[0];
          });
        }
      }).catch((error) => {
        throw new Error(error); //return error;
      });
  },
  
  initChat: () => {
    return sqlRequest(`SELECT *, NULL AS password FROM users, messages WHERE messages.author_id = users.id AND messages.room="public";`)
    .then((rows) => {
      for (let row of rows) {
        row.name = Base64.decode(row.name);
        row.text = Base64.decode(row.text);
      };
      
      rows.sort((row1, row2) => {
        if (row1.date > row2.date) return 1;
        if (row1.date < row2.date) return -1;
      });
      
      return rows;
    }).catch((error) => {
        throw new Error(error); //return error;
    });
  },
  
  messageFromClient: (message) => {
    const now = Date.now();
    
    return sqlRequest(`INSERT INTO messages (date, text, author_id) VALUES (${now},'${Base64.encode(message.text)}', '${message.author_id}');`)
    .then((rows) => {
      return sqlRequest(`SELECT *, NULL AS password FROM users, messages WHERE users.id = ${message.author_id} AND messages.room="public" AND messages.date=${now} AND messages.text="${Base64.encode(message.text)}";`)
    }).then((rows) => {
      rows[0].name = Base64.decode(rows[0].name);
      rows[0].text = Base64.decode(rows[0].text);
      return rows[0];
    }).catch((error) => {
      throw new Error(error); //return error;
    }); 
  },
  
  userLeave: (user) => {
    return sqlRequest(`UPDATE users SET status = 'offline' WHERE id="${ user.id }";`)
    .catch((error) => {
      throw new Error(error); //return error;
    });
  },
};

module.exports = controller;