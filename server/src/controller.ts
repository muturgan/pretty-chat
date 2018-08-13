import sqlRequest from './db';
// const sqlRequest = require('./db');
import base64 = require('js-base64');
const Base64 = base64.Base64;

type messageType = {
  id: number,
  name: string,
  status: string,
  password: null,
  date: number,
  room: string,
  text: string,
  author_id: number,
};

const controller = {

  initSignIn: async ( data: {name: string, password: string} ) => {
    try {
      const rows: [{ password: string }] =
        await sqlRequest(`SELECT password FROM users WHERE name="${ Base64.encode(data.name) }";`);
      if ((rows[0] === undefined) || (Base64.decode(rows[0].password) !== data.password)) {
        throw new Error('signInError');
      } else {
        await sqlRequest(`UPDATE users SET status = 'online' WHERE name="${ Base64.encode(data.name) }";`);
        const rows1: [{ id: number, name: string, status: string }] =
          await sqlRequest(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
        rows1[0].name = Base64.decode(rows1[0].name);
        return rows1[0];
      }
    } catch (error) {
      throw error;
    }
  },

  initSignUp: async ( data: {name: string, password: string} ) => {
    try {
      const rows: Array<{ name: string }> =
        await sqlRequest(`SELECT name FROM users WHERE name="${ Base64.encode(data.name) }";`);
      if (rows[0]) {
        throw new Error('signUpError');
      } else {
        await sqlRequest(`INSERT INTO users (name, password, status) VALUES ('${ Base64.encode(data.name) }', '${ Base64.encode(data.password) }', 'online');`);
        const rows1: [{ id: number, name: string, status: string }] =
          await sqlRequest(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
        return rows1[0];
      }
    } catch (error) {
      throw error;
    }
  },

  initChat: async () => {
    try {
      const rows: Array<messageType> =
        await sqlRequest(`SELECT *, NULL AS password FROM users, messages WHERE messages.author_id = users.id AND messages.room="public";`);
      for (let row of rows) {
        row.name = Base64.decode(row.name);
        row.text = Base64.decode(row.text);
      }
      rows.sort((row1, row2) => {
        if (row1.date > row2.date) return 1;
        if (row1.date < row2.date) return -1;
      });
      return rows;
    } catch (error) {
      throw error;
    }
  },

  messageFromClient: async ( message: {text: string, author_id: number} ) => {
    try {
      const now = Date.now();
      const rows: [messageType] =
        await sqlRequest(`INSERT INTO messages (date, text, author_id) VALUES (${now},'${Base64.encode(message.text)}', '${message.author_id}');`);
      rows[0].name = Base64.decode(rows[0].name);
      rows[0].text = Base64.decode(rows[0].text);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  userLeave: (user: {id: number}) => {
    return sqlRequest(`UPDATE users SET status = 'offline' WHERE id="${ user.id }";`)
    .catch((error) => {
      throw error;
    });
  },
};

export default controller;
