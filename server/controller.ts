import sqlRequest from './db';
import { messageType, userInfoType } from './types';

const Base64: {
  readonly decode: (str: string) => string,
  readonly encode: (str: string|number) => string,

} = {
  decode: (str) => Buffer.from(str, 'base64').toString('utf8'),
  encode: (str) => Buffer.from(str.toString()).toString('base64'),
};

class Controller {

  public get initSignIn() {
    return this._initSignIn;
  }

  public get initSignUp() {
    return this._initSignUp;
  }

  public get initChat() {
    return this._initChat;
  }

  public get messageFromClient() {
    return this._messageFromClient;
  }

  public get userLeave() {
    return this._userLeave;
  }

  private async _initSignIn( data: {name: string, password: string} ): Promise<userInfoType> {
    try {
      const rows: [{ password: string }] =
        await sqlRequest(`SELECT password FROM users WHERE name="${ Base64.encode(data.name) }";`);
      if ((rows[0] === undefined) || (Base64.decode(rows[0].password) !== data.password)) {
        throw new Error('signInError');
      } else {
        await sqlRequest(`UPDATE users SET status = 'online' WHERE name="${ Base64.encode(data.name) }";`);
        const rows1: [userInfoType] =
          await sqlRequest(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
        rows1[0].name = Base64.decode(rows1[0].name);
        return rows1[0];
      }
    } catch (error) {
      throw error;
    }
  }

  private async _initSignUp( data: {name: string, password: string} ): Promise<userInfoType> {
    try {
      const rows: Array<{ name: string }> =
        await sqlRequest(`SELECT name FROM users WHERE name="${ Base64.encode(data.name) }";`);
      if (rows[0]) {
        throw new Error('signUpError');
      } else {
        await sqlRequest(`INSERT INTO users (name, password, status) VALUES ('${ Base64.encode(data.name) }', '${ Base64.encode(data.password) }', 'online');`);
        const rows1: [userInfoType] =
          await sqlRequest(`SELECT id, name, status FROM users WHERE name="${ Base64.encode(data.name) }"`);
        rows1[0].name = Base64.decode(rows1[0].name);
        return rows1[0];
      }
    } catch (error) {
      throw error;
    }
  }

  private async _initChat(): Promise< Array<messageType> > {
    try {
      const rows: Array<messageType> =
        await sqlRequest(`SELECT *, NULL AS password FROM users, messages WHERE messages.author_id = users.id AND messages.room="public";`);
      for (const row of rows) {
        row.name = Base64.decode(row.name);
        row.text = Base64.decode(row.text);
      }
      rows.sort((row1, row2) => {
        if (row1.date > row2.date) { return 1; }
        if (row1.date < row2.date) { return -1; }
      });
      return rows;
    } catch (error) {
      throw error;
    }
  }

  private async _messageFromClient( message: {text: string, author_id: number} ): Promise<messageType> {
    try {
      const now = Date.now();
      await sqlRequest(`INSERT INTO messages (date, text, author_id) VALUES (${now},'${Base64.encode(message.text)}', '${message.author_id}');`);
      const rows: [messageType] =
        await sqlRequest(`SELECT *, NULL AS password FROM users, messages WHERE users.id = ${message.author_id} AND messages.room="public" AND messages.date=${now} AND messages.text="${Base64.encode(message.text)}";`);
      rows[0].name = Base64.decode(rows[0].name);
      rows[0].text = Base64.decode(rows[0].text);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  private async _userLeave(userId: number): Promise<any> {
    return sqlRequest(`UPDATE users SET status = 'offline' WHERE id="${ userId }";`)
    .catch((error) => {
      throw error;
    });
  }

}

export default Controller;
