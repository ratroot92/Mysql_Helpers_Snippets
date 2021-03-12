// # Transaction Connection 

var mysql = require('mysql');
const {dbHost,
    dbName,
    dbPort,
    dbConnections,
    dbUser,
    dbPassword} =require('../environment');


var transaction = mysql.createPool({
    connectionLimit : dbConnections,
    host:dbHost,
    user: dbUser,
    port:dbPort,
    password: dbPassword,
    database: dbName
  });



module.exports=transaction;


// # Transaction Import 
const connection = require('../config/mysql');

// # Transaction Example
insertPaper(paperObject) {
    console.log('====================================');
    console.log('insertPaper');
    console.log('====================================');
    return new Promise((resolve, reject) => {
        let {
            paperName,
            paperSession,
            paperTime,
            totalMarks,
            passingMarks,
            totalQuestions,
            examFk,
        } = paperObject;
        console.log('====================================');
        console.log(
            paperName,
            paperSession,
            paperTime,
            totalMarks,
            passingMarks,
            totalQuestions,
            examFk,
        );
        console.log('====================================');
        transaction.getConnection(function (err, connection) {
            connection.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                let insertPaperQuery = `INSERT INTO papers( paperName, paperSession, paperTime, totalMarks, passingMarks, totalQuestions) VALUES ('${paperName}','${paperSession}',${parseInt(
                    paperTime,
                    10,
                )},${parseInt(totalMarks, 10)},${parseInt(passingMarks, 10)},${parseInt(
                    totalQuestions,
                    10,
                )})`;
                connection.query(insertPaperQuery, function (error, results, fields) {
                    if (error) {
                        console.log('====================================');
                        console.log('Rollbacking Query -- Paper Insert', error);
                        console.log('====================================');
                        return connection.rollback(function () {
                            throw error;
                        });
                    }
                    const paperInsertId = results.insertId;
                    let updateExamPaperPivotQuery = `INSERT INTO paperExamPivot(examId_FK, paperId_FK) VALUES (${parseInt(
                        examFk,
                        10,
                    )},${parseInt(paperInsertId, 10)})`;
                    connection.query(updateExamPaperPivotQuery, function (error, results, fields) {
                        if (error) {
                            console.log('====================================');
                            console.log('Rollbacking Query -- Paper Insert', error);
                            console.log('====================================');
                            return connection.rollback(function () {
                                return reject(false);
                            });
                        }
                        connection.commit(function (err) {
                            if (err) {
                                console.log('====================================');
                                console.log('Rollbacking Query -- Paper Insert', err);
                                console.log('====================================');
                                return connection.rollback(function () {
                                    console.log('====================================');
                                    console.log('Transaction Failed !');
                                    console.log('====================================');
                                    return reject(false);
                                });
                            } else {
                                console.log('====================================');
                                console.log('Transaction Success !');
                                console.log('====================================');
                                return resolve(paperInsertId);
                            }
                        });
                    });
                });
            });
        });
    });