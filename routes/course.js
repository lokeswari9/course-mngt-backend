var express = require('express');
var nodeUnique = require('node-unique-array')
var router = express.Router();
var Course = require('../models/course');
var async = require('async');

router.get('/rest/getAllCourse', function(req, res) {
	
    Course.getAllCourses(function(err, rows) {
		if (err) {
            res.status(500).json({status:"error", message:err.message});
        } else {
            var courseIdArry = [], courseArry = [], courseTitleIdArry = [], allCourseArry = [];
			rows.forEach(function(row) {				
				courseIdArry.push({courseId: row.course_id, courseName: row.course_name} );				
			});
			var unique_array = new nodeUnique(courseIdArry);			
 			courseIdArry = unique_array.get();
			console.log(courseIdArry);
			courseIdArry.forEach(function(course) {
				var titleArry = [];		
				rows.forEach(function(row) {								
					if(course.courseId == row.course_id) {
						titleArry.push({courseTitleId: row.course_title_id, courseTitle: row.course_title, link: row.link, courseId: row.course_id});
					}					
				});
				var uniqueTitleArry = new nodeUnique(titleArry);			
				courseArry.push({courseName: course.courseName, courseId: course.courseId, title: uniqueTitleArry.get()});
			});
			console.log(courseArry);
			courseArry.forEach(function(course, i) {
				var titleArry = course.title;
				titleArry.forEach(function(titleObj, j) {
					var topicArry = [];
					rows.forEach(function(row) {
						if(course.courseId == row.course_id && titleObj.courseTitleId == row.course_title_id) {
							topicArry.push({topicId: row.topic_id, topicName: row.topic_name});
						}
						course.title[j].topic = topicArry;
					});
				});
			});
			console.log(courseArry)
			var uniqueCourseArry = new nodeUnique(courseArry);			
 			uniqueCourseArry = uniqueCourseArry.get();
			console.log(uniqueCourseArry);
			res.json(uniqueCourseArry);					
        }
    });
});

router.post('/rest/addNewCourse', function(req, res) {
	Course.checkCourseExist(req.body, function(err, rows) {
		if (err) {         
			res.status(500).json({status:"error", message:err.message});
		} else {
			if(rows.length == 0) {
				Course.addCourse(req.body, function(err, count) {
					if (err) {          
						res.status(500).json({status:"error", message:err.message});
					} else {
						Course.checkCourseExist(req.body, function(err, coursArry) {
							req.body.courseId = coursArry[0].COURSE_ID;
							var topicArry = req.body.topic;
							Course.checkTitleExist(req.body, function(err, titleArrry) {								
								if (err) {         
									res.status(500).json({status:"error", message:err.message});
								} else {
									if(titleArrry.length == 0) {
										Course.addCourseTitle(req.body, function(err) {
											if (err) {          
												return {status:"error", message:err.message};
											} else {
												Course.checkTitleExist(req.body, function(err, titleArryRow) {
													if (err) {          
														res.status(500).json({status:"error", message:err.message});
													} else {
														if(topicArry.length) { 
															/*topicArry.forEach(function(topic) {
																Course.addTopic(titleArryRow[0].COURSE_ID, titleArryRow[0].COURSE_TITLE_ID, topic.topicName, function(err, rows) {
																	if (err) {         
																		res.status(500).json({status:"error", message:err.message});
																	} else {
																		res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
																	}		
																});
															});*/
															async.forEach(topicArry, function(topic, callback) {
																Course.addTopic(titleArryRow[0].COURSE_ID, titleArryRow[0].COURSE_TITLE_ID, topic.topicName, function(){
																	callback();
																});
															}, function(err) {
																if (err) {         
																	res.status(500).json({status:"error", message:err.message});
																} else {
																	res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
																}	
															});	
														} else {
															res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
														}
													}
																
												});									
											}
										});
									} else {
										if(topicArry.length) {
											/*topicArry.forEach(function(topic) {
												Course.addTopic(titleArrry[0].COURSE_ID, titleArrry[0].COURSE_TITLE_ID, topic.topicName, function(err, rows) {
													if (err) {         
														res.status(500).json({status:"error", message:err.message});
													} else {
														res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
													}		
												});
											});*/
											async.forEach(topicArry, function(topic, callback) {
													Course.addTopic(titleArrry[0].COURSE_ID, titleArrry[0].COURSE_TITLE_ID, topic.topicName, function(){
														callback();
													});
												}, function(err) {
													if (err) {         
														res.status(500).json({status:"error", message:err.message});
													} else {
														res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
													}	
												});	
										} else {
											res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
										}					
												
									}
								}
							});
						});
						
					}
				});
			} else {
				req.body.courseId = rows[0].COURSE_ID;
				var topicArry = req.body.topic;
				Course.checkTitleExist(req.body, function(err, titleArrry) {	
					if (err) {         
						res.status(500).json({status:"error", message:err.message});
					} else {
						if(titleArrry.length == 0) {
							Course.addCourseTitle(req.body, function(err) {
								if (err) {          
									return {status:"error", message:err.message};
								} else {
									Course.checkTitleExist(req.body, function(err, titleArryRow) {
										if (err) {          
											res.status(500).json({status:"error", message:err.message});
										} else {
											if(topicArry.length) { 
												/*topicArry.forEach(function(topic) {
													Course.addTopic(titleArryRow[0].COURSE_ID, titleArryRow[0].COURSE_TITLE_ID, topic.topicName, function(err, rows) {
														if (err) {         
															res.status(500).json({status:"error", message:err.message});
														} else {
															res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
														}		
													});
												});*/
												async.forEach(topicArry, function(topic, callback) {
													Course.addTopic(titleArryRow[0].COURSE_ID, titleArryRow[0].COURSE_TITLE_ID, topic.topicName, function(){
														callback();
													});
												}, function(err) {
													if (err) {         
														res.status(500).json({status:"error", message:err.message});
													} else {
														res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
													}	
												});	
								
											} else {
												res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
											}
										}
													
									});									
								}
							});
						} else {
							if(topicArry.length) {
								async.forEach(topicArry, function(topic, callback) {
									Course.addTopic(titleArrry[0].COURSE_ID, titleArrry[0].COURSE_TITLE_ID, topic.topicName, function(){
										callback();
									});
								}, function(err) {
									if (err) {         
										res.status(500).json({status:"error", message:err.message});
									} else {
										res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
									}	
								});								
							} else {
								res.status(200).json({status:"success", message:"Course inserted Successfully!!"});
							}					
									
						}
					}
				});
				
			}
		}		
	});
});


router.post('/rest/updateStatus', function(req, res) {
    Course.updateCourseStatus(req.body, function(err) {
        if (err) {          
			res.status(500).json({status:"error", message:err.message});
        } else {            
			res.status(200).json({status:"success", message:"Course Updated Successfully!!"});
        }
    });
});

router.post('/rest/enroleUser', function(req, res) {
	Course.checkEnrolement(req.body, function(err, row) {
		if (err) {         
			res.status(500).json({status:"error", message:err.message});
		} else {
			if(row.length) {
				res.status(200).json({status:"success", message:"You have Already Enrolled for this topic, please try with new topic."});
			} else {
				
				Course.courseEnrolement(req.body, function(err) {
					if (err) {          
						res.status(500).json({status:"error", message:err.message});
					} else {            
						res.status(200).json({status:"success", message:"Enroled Successfully!!"});
					}
				});
			}
		}
	});
});

router.post('/rest/myEnrolledCourses', function(req, res, next) {
	Course.myEnrolledCourses(req.body, function(err, rows) {
		if (err) {          
			res.status(500).json({status:"error", message:err.message});
		} else {            
			res.status(200).json(rows);
		}
	});
});

router.post('/rest/recomendedCourses', function(req, res, next) {
	Course.getUserDetails(req.body, function(err, rows) {		
		if(rows.length) {
			Course.myAvailableCourse(rows[0].primarySkill, function(err, rows) {
				if (err) {
					res.status(500).json({status:"error", message:err.message});
				} else {
					var courseIdArry = [], courseArry = [], courseTitleIdArry = [], allCourseArry = [];
					rows.forEach(function(row) {				
						courseIdArry.push({courseId: row.course_id, courseName: row.course_name} );				
					});
					var unique_array = new nodeUnique(courseIdArry);			
					courseIdArry = unique_array.get();
					
					courseIdArry.forEach(function(course) {
						var titleArry = [];		
						rows.forEach(function(row) {								
							if(course.courseId == row.course_id) {
								titleArry.push({courseTitleId: row.course_title_id, courseTitle: row.course_title, link: row.link, courseId: row.course_id});
							}					
						});
						var uniqueTitleArry = new nodeUnique(titleArry);			
						courseArry.push({courseName: course.courseName, courseId: course.courseId, title: uniqueTitleArry.get()});
					});
					courseArry.forEach(function(course, i) {
						var titleArry = course.title;
						titleArry.forEach(function(titleObj, j) {
							var topicArry = [];
							rows.forEach(function(row) {
								if(course.courseId == row.course_id && titleObj.courseTitleId == row.course_title_id) {
									topicArry.push({topicId: row.topic_id, topicName: row.topic_name});
								}
								course.title[j].topic = topicArry;
							});
						});
					});
					var uniqueCourseArry = new nodeUnique(courseArry);			
					uniqueCourseArry = uniqueCourseArry.get();
					res.json(uniqueCourseArry);					
				}
			});
		}
	});
});

module.exports = router;