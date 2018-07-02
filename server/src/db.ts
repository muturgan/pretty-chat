import * as mysql from 'promise-mysql';

const mysqlConfig = {
  host: '128.199.39.117',
  user: 'node',
  password: 'edon',
  database: 'pretty_chat',
  port: 3306,
};

const sqlRequest = (req) => {
  return mysql.createConnection(mysqlConfig)
    .then((connection) => {
      let rows = connection.query(req);
      connection.end();
      return rows;
    }).catch((error) => {
      throw error;
    });
};

export default sqlRequest;