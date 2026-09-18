'user strict'

var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'sigqdev',
    password: 'S1gq@tla',
    database: 'Qualidade'
});

connection.connect((err) => {
    if(err) throw err;
});

module.exports = connection;
