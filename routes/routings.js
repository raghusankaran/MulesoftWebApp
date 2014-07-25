var fs = require('fs');
var paths = require('../config');
var config = paths.config;
var request = require('request');
var Promise = require('promise');
var username = 'naseem.alnaji';
var password = '1325842Mulesoft';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');


//GET all the job names
exports.getJobNames = function(req, res){
	var dList = "";

	
	var urlToHudson = config.jobHost + '/api/json';

	request(
    {
        url : urlToHudson,
        headers : {
            "Authorization" : auth
        }
    },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	        	var info = JSON.parse(body);
	  			for(var i=0; i < info.jobs.length; i++){
					dList += info.jobs[i].name +',';
				}
				
				res.send(dList);
			}
	    }
	);	
};


//Add to test file
exports.deleteJobTest = function(req, res){
	var metricID = req.query.metric;
	
	
	var filename = req.query.job + '.sla';
	var type = req.query.type;
	path = config.testFilesPath + filename;
	fs.readFile(path, {encoding: 'utf-8'}, function(err, str)
	{
		if(str == null){
			var jsonObj = {
				"sla":{},
				"prev":{},
				"base":{},
				"baseline":'-1'
			};
			
			var data = JSON.stringify(jsonObj);
			fs.writeFile(path, data, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}
		else{
			var data = JSON.parse(str);
			console.log('trying to delete: '+type + ' | ' + metricID);
			console.log(data);
			delete data[type][metricID];
			var newdata = JSON.stringify(data);
			fs.writeFile(path, newdata, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}

	});	
	res.redirect('/update?job=' + req.query.job + '&id='+req.query.id);
};


//Add baseline to test file
exports.updateBaseline = function(req, res){
	var baseID = req.query.id;

	var filename = req.query.job + '.sla';
	
	path = config.testFilesPath + filename;
	fs.readFile(path, {encoding: 'utf-8'}, function(err, str)
	{
		if(str == null){
			var jsonObj = {
				"sla":{},
				"prev":{},
				"base":{},
				"baseline":baseID
			};
			console.log('Created file with baseline = ' + jsonObj['baseline']);
			var data = JSON.stringify(jsonObj);
			fs.writeFile(path, data, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}
		else{
			var data = JSON.parse(str);
			console.log(baseID);
			data["baseline"] = baseID;
			console.log('Added to file with baseline = ' + data['baseline']);
			var newdata = JSON.stringify(data);
			fs.writeFile(path, newdata, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}
	});
	res.redirect(config.report + req.query.job);
};


//Add to test file
exports.addJobTest = function(req, res){
	var metricID = req.body.checkList;
	console.log(metricID);
	var min = req.body.min;

	var max = req.body.max;

	var filename = req.query.job + '.sla';
	var type = req.query.type;
	path = config.testFilesPath + filename;
	fs.readFile(path, {encoding: 'utf-8'}, function(err, str)
	{
		if(str == null){
			var jsonObj = {
				"sla":{},
				"prev":{},
				"base":{},
				"baseline":'-1'
			};
			jsonObj[type][metricID] = [min,max];
			var data = JSON.stringify(jsonObj);
			fs.writeFile(path, data, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}
		else{
			var data = JSON.parse(str);
			data[type][metricID] = [min, max];
			var newdata = JSON.stringify(data);
			fs.writeFile(path, newdata, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
			});
		}

	});	
	res.redirect('/update?job=' + req.query.job + '&id=' + req.query.id);
};


//GET all the job names
exports.getTestMetrics = function(req, res){
	var job = req.query.job;
	var filename = job+'.sla';
	var path = config.testFilesPath + filename;
	fs.readFile(path, {encoding: 'utf-8'}, function(err, str)
	{
		if(str == null){
			res.send(null);
		}
		else
			res.send(str);
	});	
	
};

//GET builds in order of timestamp
exports.getRecentJobs = function(req, res){
	var dList = "";

	
	var urlToHudson = config.jobHost + '/api/json?tree=jobs[name,lastBuild[number,timestamp,result]]';

	request(
    {
        url : urlToHudson,
        headers : {
            "Authorization" : auth
        }
    },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	        	var info = JSON.parse(body);
	  			
	  			var data = [];

				res.send(info);
			}
	    }
	);	
};

//GET all the build names
exports.getBuildNames = function(req, res){ 
	var buildName = req.query.build;

	var dList = "";
	var urlToHudson = config.jobHost + '/job/'+ buildName + '/api/json'

	request(
    {
        url : urlToHudson,
        headers : {
            "Authorization" : auth
        }
    },
	    function (error, response, body) 
	    {
	        if (!error && response.statusCode == 200) {
	        	//
	        	var info = JSON.parse(body);

	  			for(var i=0; i < info.builds.length; i++){
					dList += info.builds[i].number +',';
				}
				
				res.send(dList);
			}
	    }
	);
};

//GET all the build names
exports.getBuildsByDescription = function(req, res){ 
	var buildName = req.query.build;

	var dList = "";
	var descriptions ="";
	var urlToHudson = config.jobHost + '/job/'+ buildName + '/api/json?tree=builds[number,description]'

	request(
    {
        url : urlToHudson,
        headers : {
            "Authorization" : auth
        }
    },
	    function (error, response, body) 
	    {
	        if (!error && response.statusCode == 200) {
	        	//
	        	var info = JSON.parse(body);
				res.send(info);
			}
	    }
	);
};


//GETREQUEST to Hudson for all relative names in /archive
		//LINK: ?tree=artifacts[relativePath]

	
function getPathToParsed(jobName, buildID){

	
	//Create promise
	var getPathToParsed = new Promise(function (resolve, reject){
		var fileID = '';
		var urlToHudson = config.jobHost + '/job/'+ jobName +'/'+ buildID +'/api/json';

		//Get ID
		request(
	    {
	        url : urlToHudson,
	        headers : {
	            "Authorization" : auth
	        }
	    },
		    function (error, response, body) {
		    	
		        if (!error && response.statusCode == 200) {
		        	var info = JSON.parse(body);	  			
					fileID = info.id;
					resolve(fileID);
				}
				else
					resolve('');
		});
	});

	return new Promise(function (resolve, reject){

			getPathToParsed.then(function (fileID){
			//This is the URL we will be submitting our get request... I suggest looking into the hudson API for more info
			var urlToHudson = config.jobHost + '/job/'+ jobName + '/' + buildID +'/api/json?tree=artifacts[relativePath]';
			var pathToParsed = '';

			request(
		    {
		        url : urlToHudson,
		        //This is how we authenticate accessing hudson
		        headers : {
		            "Authorization" : auth
		        }
		    },

			    function (error, response, body) 
			    {
			        if (!error && response.statusCode == 200) {
			        	
			        	var info = JSON.parse(body);		        	
			  			for(var i=0; i < info.artifacts.length; i++){
			  				//we search for the path to 'parsed'
			  				pathToParsed = info.artifacts[i].relativePath;
							if( pathToParsed.indexOf('parsed') >= 0){
								pathToParsed = pathToParsed.substring(0, pathToParsed.indexOf('parsed') +7);
								break;
							}
						}

						resolve( config.hudsonPath+jobName+'/builds/'+fileID+'/archive/' + pathToParsed);//chosen
					}
					resolve('');
			    }
			);
		});
	});
}



// Let us generalize how we read the directories that contain our TXT Files
//End result is an array of objects that represent the metric files 

// return array --- [{filename: name1, data: d1}, {filename: name2, data:d2}, ... ]
function getMetricsInFolder(pathToDirectory){
	//Create empty array "metricFileObjs" to represent all the metric files
	var metricFileObjs = [];
	

	//Use an synchronous call to access the directory
	// readdirSync takes a directory and returns the names of the files a depth of 1 inside of it
	var listOfFilenames = [];
	try{
		listOfFilenames = fs.readdirSync(pathToDirectory);	
		for(var i in listOfFilenames){
			//Create a fileObj for the target file
			var fileObj = fileToObject(pathToDirectory +'/'+listOfFilenames[i]);

			//Add the fileObj to 'metricFileObjs'
			metricFileObjs.push(fileObj);			
		}

		
	}catch(err){

	}
	//access all the TXT bodies of the filenames
	//For all the files in the directory
	return metricFileObjs;	
		
}

//Since we are always accessing files for metrics, let us generalize the methods!

//End goal is to return an object that represents the file:
	/*  return = 
		{
			filename: nameOfFile 
			data: [123, 123, ...] //The data file will be parse line by line
								  // Obviously singular data entries will have a length of 1
		}
	*/
function fileToObject(pathToFile){
	//Create object fileObj
	var fileObj = {};
	//Set fileObj.filename to the file name
	//console.log('Does it break here?' + pathToFile); //XXXXXX
	var filename = pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.indexOf('.txt'));
	fileObj.filename = filename;
	try{
		//Use a synchronous call to access the data
		var str = fs.readFileSync(pathToFile, {encoding: 'utf-8'});	
		//console.log(' --> Going inside the file ' + filename + ' we find: ' + str);
		//create array of data
		
		var dataFound = [];
		//parse the body by new lines	
		dataFound = str.split(/\n/g);
		
		if(dataFound[dataFound.length-1] == ''){
			dataFound.pop();
		}
		if(dataFound.length < 4)
			console.log(dataFound);

		//Set fileObj.data = data
		fileObj.data = dataFound;
	}catch(err){}
	
	//return the result
	return fileObj;
}

//returns an array of all the job names in the logs folder
function getAllPerfCIJobs(id){

	var getFileID = new Promise(function (resolve, reject){
		var fileID = '';
		var urlToHudson = config.jobHost + '/job/PERF_CI/'+ id +'/api/json';
		console.log(urlToHudson);
		//Get ID
		request(
	    {
	        url : urlToHudson,
	        headers : {
	            "Authorization" : auth
	        }
	    },
		    function (error, response, body) {
		    	
		        if (!error && response.statusCode == 200) {
		        	var info = JSON.parse(body);	  			
					fileID = info.id;
					
					resolve(fileID);
				}
				else
					resolve('');
		});
	});
	return new Promise(function (resolve, reject) {
		getFileID.then(function (fileID){

			//path to logs
			var path = config.hudsonPath+'PERF_CI'+'/builds/'+fileID+'/archive/logs';

			var listOfFilenames = [];
			var result = '';
			try{
				listOfFilenames = fs.readdirSync(path);	
				console.log(listOfFilenames);
				for(var i=0; i<listOfFilenames; i++){
					result += config.hudsonPath+'PERF_CI/builds/'+fileID+'/archive/logs' +listOfFilenames[i] + '/parsed,';
				}
				console.log(result);
								
			}catch(err){

			}
			//access all the TXT bodies of the filenames
			//For all the files in the directory
			resolve(result);
		});
	});
		
}


//NEW GETDATA REQUEST
exports.getParsedData = function(req, res){
	var id = req.query.id;
	var jobName = req.query.jobName;
	var result ={};
	if(jobName == 'PERF_CI'){
		var perfPromise = getAllPerfCIJobs(id);
		perfPromise.then( function (stringOfPaths){
			console.log(stringOfPaths);
			var listOfJobPaths = stringOfPaths.split(',');
			listOfJobPaths.pop();
			for(var i=0; i<listOfJobPaths.length; i++){
				var perfJobName = listOfJobPaths[i].substring(listOfJobPaths[i].indexOf('logs/')+5,listOfJobPaths[i].indexOf('/parsed'));
				result[''+ perfJobName] = {};
				//XXXXXX
				var subResult = {};
				path = listOfJobPaths[i];

				//ERROR CASE:
				if(path.indexOf('parsed') < 0){
					subResult['SingularData'] = {  
												'Summary': {}, 
												'Test_Results': {}, 
												'System_Resources': {}, 
												'JVM': {}
											 };
					result[perfJobName] = subResult;
				}
				else{
					//Create object 'summary'
					var summary = {};
					//Access Summary directory
					var summaryElements = getMetricsInFolder(path + 'Summary');
					//FOR every file in the directory
					for(var i in summaryElements){
						//summary[filename] = txtbody			
						summary[summaryElements[i].filename] = summaryElements[i].data[0];
					}
					//Create object test_results
					var test_results = {};
					//Access Test_Results directory	
					var testElements = getMetricsInFolder(path + 'Test_Results');
					//FOR every file in the directory
					for(var i in testElements){
						//test_results[filename] = txtbody
						test_results[testElements[i].filename] = testElements[i].data;
					}
						
					
					//Create object 'system_resources'
					var system_resources = {};
					//Access System_Resources directory
					var sysElements = getMetricsInFolder(path + 'System_Resources');
					//FOR every file in the directory

					for(var i in sysElements){
						//system_resources[filename] = txtbody
						system_resources[sysElements[i].filename] = sysElements[i].data;
					}
					
					
					//Create object jvm
					var jvm = {};
					//Access JVM directory
					var jvmElements = getMetricsInFolder(path + 'JVM');
					//FOR every file in the directory
					for(var i in jvmElements){
						//jvm[filename] = txtbody
						jvm[jvmElements[i].filename] = jvmElements[i].data;
					}

					var plots = {};

					var plotElements = getMetricsInFolder(path+'PlotData');

					//FOR every file in the directory
					for(var i in plotElements){
						//plot[filename] = txtbody
						plots[plotElements[i].filename] = plotElements[i].data;
					}


					
					//Compile all objects ---
					
					subResult['SingularData'] = {  
												'Summary': summary, 
												'Test_Results': test_results, 
												'System_Resources': system_resources, 
												'JVM': jvm
											};
					subResult['GraphData'] = plots;
					result[perfJobName] = subResult;
				}

			}

			res.send(result);
		});
		
	}
	else{
		//FIND the parsed directory's path
		var promise = getPathToParsed(jobName, id);

		//Now that we have a path to PARSED we intend on returning a JSON of data of the following format:

		/*REUTURN : 
			{
				SingularData:
				{
					Summary: 
						{
							Test_Duration_Sec: 313 //Stored in parsed/Summary/Test_Duration_Sec.txt
						}
						
					Test_Results:
						{
							Avg_Response_Time: XXX
							Error_Percent: XXX
							Max_Response_TIme: XXX
							Min_Response_TIme: XXX
							Throughput_TPS: XXX
						}
					System_Resources:
						{
							Avg_CPU: 36.6
							XXX: XXX
						}				
					JVM:
						{
							GC_Failure_Count: XXX
						}
				}			
				GraphData:
				{
					CPU_Usage: [12,13,12,10,13, ...] //Stored in parsed/PlotData/CPU_Usage.txt
					CPU_IO_Wait: [30.013, 30.1, 31.03, ...] //Stored in CPU_IO_Wait.txt
				}
			}
		*/
		promise.then(function (path){
			

			
			//ERROR CASE:
			if(path.indexOf('parsed') < 0){
				result['SingularData'] = {  
											'Summary': {}, 
											'Test_Results': {}, 
											'System_Resources': {}, 
											'JVM': {}
										 };
				res.send(result);
			}
			else{
				//Create object 'summary'
				var summary = {};
				//Access Summary directory
				var summaryElements = getMetricsInFolder(path + 'Summary');
				//FOR every file in the directory
				for(var i in summaryElements){
					//summary[filename] = txtbody			
					summary[summaryElements[i].filename] = summaryElements[i].data[0];
				}
				//Create object test_results
				var test_results = {};
				//Access Test_Results directory	
				var testElements = getMetricsInFolder(path + 'Test_Results');
				//FOR every file in the directory
				for(var i in testElements){
					//test_results[filename] = txtbody
					test_results[testElements[i].filename] = testElements[i].data;
				}
					
				
				//Create object 'system_resources'
				var system_resources = {};
				//Access System_Resources directory
				var sysElements = getMetricsInFolder(path + 'System_Resources');
				//FOR every file in the directory

				for(var i in sysElements){
					//system_resources[filename] = txtbody
					system_resources[sysElements[i].filename] = sysElements[i].data;
				}
				
				
				//Create object jvm
				var jvm = {};
				//Access JVM directory
				var jvmElements = getMetricsInFolder(path + 'JVM');
				//FOR every file in the directory
				for(var i in jvmElements){
					//jvm[filename] = txtbody
					jvm[jvmElements[i].filename] = jvmElements[i].data;
				}

				var plots = {};

				var plotElements = getMetricsInFolder(path+'PlotData');

				//FOR every file in the directory
				for(var i in plotElements){
					//plot[filename] = txtbody
					plots[plotElements[i].filename] = plotElements[i].data;
				}


				
				//Compile all objects ---
				
				result['SingularData'] = {  
											'Summary': summary, 
											'Test_Results': test_results, 
											'System_Resources': system_resources, 
											'JVM': jvm
										};
				result['GraphData'] = plots;
				res.send(result);
			}

		});
	}
	
}
























