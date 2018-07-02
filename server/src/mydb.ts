import * as mysql from 'promise-mysql';
import * as mymysql from 'mysql';

const mysqlConfig = {
  host: '128.199.39.117',
  user: 'node',
  password: 'edon',
  database: 'pretty_chat',
  port: 3306,
};

const myRequest = (req:string) => {
  return new Promise(function(resolve, reject) {
    let connection = mymysql.createConnection(mysqlConfig);
    connection.connect();
    
    connection.query(req, function (error, rows) {
      if (error) {
        reject (error);        
      }
      resolve(rows);
    });
    
    connection.end();
  });
};

export default myRequest;