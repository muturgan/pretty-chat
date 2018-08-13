import mysql from 'promise-mysql';

const mysqlConfig = {
    host: '128.199.39.117',
    user: 'node',
    password: 'edon',
    database: 'pretty_chat',
    port: 3306,
};

const sqlRequest = async (req: string) => {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        const rows = await connection.query(req);
        connection.end();
        return rows;
    } catch (error) {
        throw error;
    }

  // return mysql.createConnection(mysqlConfig)
  //   .then((connection) => {
  //     const rows = connection.query(req);
  //     connection.end();
  //     return rows;
  //   }).catch((error) => {
  //     throw error;
  //   });
};

export default sqlRequest;
