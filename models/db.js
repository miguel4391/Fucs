var mysql = require('mysql2');

var connection = mysql.createPool({
    host    : '127.0.0.1',
    user    : 'sigqdev',
    password: 'S1gq@tla',
    database: 'Qualidade',
	waitForConnections: true,
	connectionLimmit: 10,
	queueLimit: 0
});

//connection.connect(function(err){
//    if(err) throw err;
//});

module.exports = connection;
