var mysql = require('mysql');
const {dbHost,
    dbName,
    dbPort,
    dbConnections,
    dbUser,
    dbPassword} =require('../environment');


var pool = mysql.createPool({
    connectionLimit : dbConnections,
    host:dbHost,
    user: dbUser,
    port:dbPort,
    password: dbPassword,
    database: dbName
  });
  const connection = {
    query: function () {
        var queryArgs = Array.prototype.slice.call(arguments),
            events = [],
            eventNameIndex = {};

        pool.getConnection(function (err, conn) {
            if (err) {
                if (eventNameIndex.error) {
                    eventNameIndex.error();
                }
            }
            if (conn) { 
                var q = conn.query.apply(conn, queryArgs);
                q.on('end', function () {
                    conn.release();
                });

                events.forEach(function (args) {
                    q.on.apply(q, args);
                });
            }
        });
    }
}


module.exports=connection;