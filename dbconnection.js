var mysql = require('mysql');
var connection = mysql.createPool({
    host: '10.137.251.91', 
	//host: 'devcloud.hclets.com',
	port: '37306',
    user: 'polymer',
    password: 'polymer',
    database: 'polymer'
});
/*var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Root',
    database: 'coursedb'
});*/
module.exports = connection;