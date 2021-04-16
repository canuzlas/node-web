const mysql = require("mysql");
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodejsproje'
  },{multipleStatements: true })
connection.connect();

module.exports = connection;