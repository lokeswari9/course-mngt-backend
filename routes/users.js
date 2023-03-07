var express = require('express');
var router = express.Router();
var Users = require('../models/users');

router.post('/rest/login', function(req, res, next) {
    Users.loginUser(req.body, function(err, row) {		
        if (err) {          
			res.status(500).json({status:"error", message:err.message});
        } else {
			if(row.length){
				res.status(200).json({status:"success", message:"Valid User", data: row});
			}	else {
				res.status(200).json({status:"error", message:"InValid User"});
			}			
        }
    });
});

router.post('/rest/registerUser', function(req, res, next) {
	Users.checkUserExist(req.body, function(err, rows) {
		if (err) {         
			res.status(500).json({status:"error", message:err.message});
		} else {
			if(rows.length) {
				res.status(200).json({status:"success", message:"User already exist!!"});
			} else {				
				Users.addNewUser(req.body, function(err) {
					if (err) {          
						res.status(500).json({status:"error", message:err.message});
					} else {            
						res.status(200).json({status:"success", message:"Registered Successfully!!"});
					}
				});
			}
		}
		
	});
});

router.get('/rest/getUserList', function(req, res) {
    Users.getUserList(function(err, rows) {		
        if (err) {          
			res.status(500).json({status:"error", message:err.message});
        } else {
			res.json(rows);		
        }
    });
});

module.exports = router;