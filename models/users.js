var db = require('../dbconnection'); //reference of dbconnection.js

var User = {

    loginUser: function(loginData, callback) {
        return db.query("select * from user_details where EMAILID=? and PASSWORD=?", [loginData.userName, loginData.password], callback);
    },

	checkUserExist: function(userData, callback) {
		return db.query("select * from user_details where sapid=?", [userData.sapId], callback);
	},
	
    addNewUser: function(userData, callback) {
        return db.query("insert into user_details (NAME, SAPID, EMAILID, PRIMARYSKILL, BAND, PASSWORD) values(?,?,?,?,?,?)", [userData.name, userData.sapId, userData.emailId, userData.primarySkill, userData.band, userData.password], callback);				
    },
	
	getUserList: function(callback) {
		return db.query("select * from user_details", callback);
	}

};
module.exports = User;