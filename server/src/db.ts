// import * as mysql from 'promise-mysql';
const mysql = require('promise-mysql');

const mysqlConfig = {
  host: '128.199.39.117',
  user: 'node',
  password: 'edon',
  database: 'pretty_chat',
  port: 3306,
};

const sqlRequest = (req: string) => {
  return mysql.createConnection(mysqlConfig)
    .then((connection) => {
      const rows = connection.query(req);
      connection.end();
      return rows;
    }).catch((error) => {
      throw error;
    });
};

module.exports = sqlRequest;

// export default sqlRequest;
