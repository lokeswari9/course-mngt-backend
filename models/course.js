var db = require('../dbconnection'); //reference of dbconnection.js
var async = require('async');
var Course = {

	getAllCourses: function(callback) {
		return db.query("select course.course_id, course.course_name, title.course_title_id, title.course_title, title.link, topic.topic_id, topic.topic_name from course course, course_title title, course_topic topic where course.course_id = title.course_id and title.course_title_id = topic.course_title_id", callback);
	},
	
	getCourseTitle: function(courseId, callback) {
		return db.query("select * from course_title where course_id=?", [courseId], callback);
	},   

    addNewCourseDeatils: function(courseData) {
		console.log(courseData);
		var query = "select * from course where course_id = " + courseData.courseId  + ";";
		var query1 = "insert into course(course_id, course_name) values (" + courseData.courseId + ", '" + courseData.courseName + "');";
		var query2 = "insert into course_title(course_id, course_title_id, course_title, link) values (" + courseData.courseId + ", " + courseData.courseTitleId + ", '"+ courseData.courseTitle +"', '" + courseData.link + "');";
		var query4 = "select * from course_title where course_id = " + courseData.courseId  + " and course_title_id = " + courseData.courseTitleId + ";";
		var return_data = {};
		
		async.parallel([
		   function(parallel_done) {
			   db.query(query, {}, function(err, results) {
				   if (err) return parallel_done(err);
					else{  
						console.log(results.length == 0);
					   if(results.length == 0){
						   console.log("inside lloop");
							db.query(query1, {}, function(err, results) {
							   if (err) return parallel_done(err);
							   return_data.table1 = results;
							   parallel_done();
						   }); 
					  }
				   }				   
			   });			   
		   },
		   function(parallel_done) {			   
			   db.query(query4, {}, function(err, results) {
				   console.log("__________");
				   if (err) return parallel_done(err);
				   else {
					  console.log(results.length == 0);
					   if(results.length == 0){
						   console.log("inside lloop");
						   db.query(query2, {}, function(err, results) {
						   if (err) return parallel_done(err);
						   return_data.table2 = results;
						   parallel_done();
						  }); 
						}					   
				   }				   
			   });   
			   
		   },
		   function(parallel_done) {
			   var topicArry = courseData.topic;
			   topicArry.forEach(function(topic, i) {
				   var query3 = "insert into course_topic(course_id, course_title_id, topic_name) values (" + courseData.courseId + ", " + courseData.courseTitleId + ", '"+ topic.topicName +"');";
				   db.query(query2, {}, function(err, results) {
					   if (err) return parallel_done(err);
					   return_data.table3 = results;
					   parallel_done();
					});
			   });
		   }
		   
		], function(err) {
			 if (err) console.log(err);
			 db.end();
			 console.log(return_data);
			 
		});
    },

    updateCourseStatus: function(courseData, callback) {
		return db.query("update user_enrolement set comments=?, status=?, teachOthers=? where course_id=? and emailid=?", [courseData.comments, courseData.status, courseData.teachOthers, courseData.courseId, courseData.emailId], callback);
    },

	checkEnrolement: function(courseData, callback) {
		//return db.query("select * from user_enrolement where course_id=? and course_title_id=? and topic_id=? and sapId=?",[courseData.courseId, courseData.courseTitleId, courseData.topicId, courseData.sapId], callback);
		return db.query("select * from user_enrolement where course_id=? and emailId=?",[courseData.courseId, courseData.emailId], callback);
	},
	
    courseEnrolement: function(courseData, callback) {
        return db.query("insert into user_enrolement (COURSE_ID, COURSE_NAME, EMAILID, STATUS) values (?,?,?,?)", [courseData.courseId, courseData.courseName, courseData.emailId, "Not Yet Started"], callback);
    },
	
	checkCourseExist: function(courseData, callback) {
		return db.query("select * from course where course_name=?",[courseData.courseName], callback);
	},
	
	addCourse: function(courseData, callback) {
		return db.query("insert into course(course_name) values (?)",[courseData.courseName], callback);
	},
	
	checkTitleExist: function(courseData, callback) {
		return db.query("select * from course_title where course_id=? and course_title = ?",[courseData.courseId, courseData.courseTitle], callback);
	},
	
	addCourseTitle: function(courseData, callback) {
		return db.query("insert into course_title(course_id, course_title, link) values (?,?,?)",[courseData.courseId, courseData.courseTitle, courseData.link], callback);
	},
	
	addTopic: function(courseId, courseTitleId, topicName, callback) {
		return db.query("insert into course_topic(course_id, course_title_id, topic_name) values (?,?,?)",[courseId, courseTitleId, topicName], callback);
	},	
	
	myEnrolledCourses: function(userDetails, callback) {
		return db.query("select * from user_enrolement where emailId=?",[userDetails.emailId], callback);		
	},
	
	getUserDetails: function(userDetails, callback) {
		return db.query("select primarySkill from user_details where emailid = ?", [userDetails.emailId] , callback);		
	},
	
	myAvailableCourse: function(primarySkill, callback) {
		return db.query("select course.course_id, course.course_name, title.course_title_id, title.course_title, title.link, topic.topic_id, topic.topic_name from course course, course_title title, course_topic topic where course.course_id = title.course_id and title.course_title_id = topic.course_title_id and course.course_name like '%" + primarySkill + "%'" , callback);		
	}
	
};
module.exports = Course;