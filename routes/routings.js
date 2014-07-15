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
	var metricID = req.query.metric + ' ';
	metricID = metricID.replace('%20', '+');
	metricID = metricID.replace('+', ' ');
	metricID = metricID.replace(/\+/g, ' ');
	
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
	res.redirect('/update?job=' + req.query.job);
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
	var metricID = req.body.checkList + req.body.modifier + ' ';

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
	res.redirect('/update?job=' + req.query.job);
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

//GET a specific set of data using the following inputs:
//	-job = name of job
//  -id  = name of build
//  -type = type of data
exports.getData = function(req, res){
	var id = req.query.id;
	var job = req.query.job;
	var type = req.query.type;

	var fileID = '';
	var urlToHudson = config.jobHost + '/job/'+job+'/'+ id +'/api/json';

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
			
	    	
				var path = config.hudsonPath+job+'/builds/'+fileID+'/archive/';
				var relative = 'ERROR';
				//
				for(var i=0; i < info.artifacts.length; i++){
					//
					if(info.artifacts[i].fileName.indexOf('sar.cpuusage') >= 0){
						relative = info.artifacts[i].relativePath.substring(0,info.artifacts[i].relativePath.length-16);
						break;
					}
				}
				if(relative == 'ERROR'){
					res.send('Bad build');
				}
				else{
					path+=relative;
					//
					if(type.indexOf('cpu') >=0)
					{	
						var nameOfFile = 'sar.cpuusage.out';
						//
						if(type.indexOf('use') >=0){	
							fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
							{
								
								var locateStart = str.indexOf('%idle');
								str = str.substring(locateStart+5);
								var dataSet = str.match(/\s\s\d+\.\d+/g);
								//usr + nice + sys + irq 
								var data = '';
								
								var jump = 9;
								for(var i = 0; i < dataSet.length; i+= jump)
								{
									data += (parseFloat(dataSet[i]) + parseFloat(dataSet[i+1]) + parseFloat(dataSet[i+2]) + parseFloat(dataSet[i+5]))+',';
								}
								res.send(data);
							});					
						}
						else if(type.indexOf('iowait') >=0){
							fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
							{
								
								var locateStart = str.indexOf('%idle');
								str = str.substring(locateStart+5);
								var dataSet = str.match(/\s\s\d+\.\d+/g);
								//usr + nice + sys + irq 
								var data = '';
								
								var jump = 9;
								for(var i = 0; i < dataSet.length; i+= jump)
								{
									data += dataSet[i+3]+',';
								}
								res.send(data);
							});	

						}
						else if(type.indexOf('steal') >=0){
							fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
							{
								
								var locateStart = str.indexOf('%idle');
								str = str.substring(locateStart+5);
								var dataSet = str.match(/\s\s\d+\.\d+/g);
								//usr + nice + sys + irq 
								var data = '';
								
								var jump = 9;
								for(var i = 0; i < dataSet.length; i+= jump)
								{
									data += dataSet[i+4]+',';
								}
								res.send(data);
							});	
						}
					}
					else if(type.indexOf('mem') >=0)
					{	
						var nameOfFile = 'sar.memutil.out';
						if(type.indexOf('use') >=0){
							
							//
							fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
							{
								
								var locateStart = str.indexOf('%commit');
								str = str.substring(locateStart+7);
								var dataSet = str.match(/\s\s\d+(\.)?\d+/g);
								//usr + nice + sys + irq 
								var data = '';
								
								var jump = 7;
								for(var i = 0; i < dataSet.length; i+= jump)
								{
									data += dataSet[i+2]+',';
								}
								res.send(data);
							});	
						}
						else if(type.indexOf('kbcache') >=0){
							fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
							{
								
								var locateStart = str.indexOf('%commit');
								str = str.substring(locateStart+7);
								var dataSet = str.match(/\s\s\d+(\.)?\d+/g);
								//usr + nice + sys + irq 
								var data = '';
								
								var jump = 7;
								for(var i = 0; i < dataSet.length; i+= jump)
								{
									data += dataSet[i+4]+',';
								}
								res.send(data);
							});
						}
						else if(type.indexOf('kbbuffers') >=0){
							fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
							{
								
								var locateStart = str.indexOf('%commit');
								str = str.substring(locateStart+7);
								var dataSet = str.match(/\s\s\d+(\.)?\d+/g);
								//usr + nice + sys + irq 
								var data = '';
								
								var jump = 7;
								for(var i = 0; i < dataSet.length; i+= jump)
								{
									data += dataSet[i+3]+',';
								}
								res.send(data);
							});
						}						
					}

					else if(type.indexOf('disk') >=0){
						var nameOfFile = 'sar.device.out';
						
						fs.readFile(path + nameOfFile, {encoding: 'utf-8'}, function(err, str)
						{			
							var temp = str.match(/\s\d+\.\d\d/g);
							var data = '';
							if(type.indexOf('util') >=0){
								for(var i = 0; i < temp.length; i++){
									if((i+1) % 8 == 0){
										data += temp[i]+',';
									}
								}
							}

							else if(type.indexOf('await') >=0){
								for(var i = 0; i < temp.length; i++){
									if((i+1) % 8 == 6){
										data += temp[i]+',';
									}
								}
							}
							else if(type.indexOf('tps') >=0){
								for(var i = 0; i < temp.length; i++){
									if((i+1) % 8 == 1){
										data += temp[i]+',';
									}
								}

							}
							else if(type.indexOf('wr_sec') >=0){
								
								for(var i = 0; i < temp.length; i++){
									if((i+1 )% 8 == 3){
										data += temp[i]+',';
									}
								}
							}
							else if(type.indexOf('rd_sec') >=0){
								
								for(var i = 0; i < temp.length; i++){
									if((i+1) % 8 == 2){
										data += temp[i]+',';
									}
								}
							}
							res.send(data);

						});

						
					}

					else if(type.indexOf('network') >=0){
						var nameOfFile = 'sar.network.DEV.out';
						fs.readFile(path + nameOfFile, {encoding: 'utf-8'}, function(err, str)
						{			
							var temp = str.split(/[^\w)\d]\n/g);
							var subgroups = [];
							temp.splice(0,1);
							var sections = temp.length;
							for(var i = 0; i < temp.length; i++){
								subgroups[subgroups.length] = temp[i].match(/\s\s\d+\.\d+/g);
							}
							var maxTString = '';
							var maxRString = '';
							var len = subgroups[0].length/7;
							
							temp = str.match(/\s\s\d+\.\d+/g);
							var maxT = 0, maxR=0;
							var dataT = [], dataR = [];
							for(var i = 0; i <  temp.length; i++){
								if((i+1) % 7 == 4)
								{
									dataT[dataT.length] = temp[i];
								}
								else if((i+1) % 7 == 3 ){
									dataR[dataR.length] = temp[i];
								}
							}
							var maxRSet = [];
							var maxTSet = [];
							var count = 0;
							for(var k = 0; k < dataT.length; k++){
								if(count == len ){
									maxTSet[maxTSet.length] = ''+ maxT;
									maxTString += maxT +',';
									maxT = 0;
									count = 0;
								}
								
								if(maxT < dataT[k]){
									maxT = dataT[k];	
								}
								count++;
								
							}
							count = 0;
							for(var k = 0; k < dataR.length; k++){
								if(count == len ){
									maxRSet[maxRSet.length] = maxR;
									maxRString += maxR +',';
									maxR = 0;
									count = 0;
								}
								
								if(maxR < dataR[k]){
									maxR = dataR[k];	
								}
								count++;
								
							}
							var data = '';
							if(type.indexOf('used') >=0){
								data = '';
								for(var i = 0; i < maxRSet.length; i++){
									var temp = Math.max(maxRSet[i], maxTSet[i]);
									temp = (((temp * 8 ) / 1024 )/ 102.4);
									data += temp + ',';
								}
								res.send(data);
							}
							else if(type.indexOf('txkB') >=0){
								res.send(maxTString);
							}
							else if(type.indexOf('rxkB') >=0){
								res.send(maxRString);
							}
							
						});
						
					}

					else if(type.indexOf('duration') >=0){
						res.send(''+ info.duration);
					}

					else{
						res.send('');
						
					}
				}
			}
	});
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
	var listOfFilenames = fs.readdirSync(pathToDirectory);	
	console.log('All the files in ' +pathToDirectory+ ' are: ' + listOfFilenames);
	//access all the TXT bodies of the filenames
	//For all the files in the directory
	for(var i in listOfFilenames){
		//Create a fileObj for the target file
		console.log('Going into: ' + pathToDirectory +'/'+listOfFilenames[i]);
		var fileObj = fileToObject(pathToDirectory +'/'+listOfFilenames[i]);

		//Add the fileObj to 'metricFileObjs'
		metricFileObjs.push(fileObj);			
	}

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
	var filename = pathToFile.substring(pathToFile.lastIndexOf('/') + 1, pathToFile.indexOf('.txt'));
	fileObj.filename = filename;
	//Use a synchronous call to access the data
	var str = fs.readFileSync(pathToFile, {encoding: 'utf-8'});	
	//console.log(' --> Going inside the file ' + filename + ' we find: ' + str);
	//create array of data
	var dataFound = [];
	//parse the body by new lines	
	dataFound = str.split('/n');
	
	//Set fileObj.data = data
	fileObj.data = dataFound;
	console.log(JSON.stringify(fileObj));
	//return the result
	return fileObj;
}


//NEW GETDATA REQUEST
exports.getParsedData = function(req, res){
	var id = req.query.id;
	var jobName = req.query.jobName;
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
			
			PlotData:
			{
				CPU_Usage: [12,13,12,10,13, ...] //Stored in parsed/PlotData/CPU_Usage.txt
				CPU_IO_Wait: [30.013, 30.1, 31.03, ...] //Stored in CPU_IO_Wait.txt
			}
		}
	*/
	promise.then(function (path){
		console.log('The path to "parsed" is: ' + path);
		//Create object 'summary'
		var summary = {};
		//Access Summary directory
		var summaryElements = getMetricsInFolder(path + 'Summary');
		//FOR every file in the directory
		for(var i in summaryElements){
			//summary[filename] = txtbody			
			summary[summaryElements[i].filename] = summaryElements[i].data[0];
		}
		console.log('This is what summary looks like: ' + JSON.stringify(summary));
		//Create object test_results
		var test_results = {};
		//Access Test_Results directory	
		var testElements = getMetricsInFolder(path + 'Test_Results');
		//FOR every file in the directory
		for(var i in testElements){
			//test_results[filename] = txtbody
			test_results[testElements[i].filename] = testElements[i].data[0];
		}
			
		console.log('This is what test_results looks like: ' + JSON.stringify(test_results));
	
		//Create object 'system_resources'
		var system_resources = {};
		//Access System_Resources directory
		var sysElements = getMetricsInFolder(path + 'System_Resources');
		//FOR every file in the directory
		for(var i in sysElements){
			//system_resources[filename] = txtbody
			system_resources[sysElements[i].filename] = sysElements[i].data[0];
		}
		console.log('This is what system_resources looks like: ' + JSON.stringify(system_resources));
	
		//Create object jvm
		var jvm = {};
		//Access JVM directory
		var jvmElements = getMetricsInFolder(path + 'JVM');
		//FOR every file in the directory
		for(var i in jvmElements){
			//jvm[filename] = txtbody
			jvm[jvmElements[i].filename] = jvmElements[i].data[0];
		}
		console.log('This is what jvm looks like: ' + JSON.stringify(jvm));
		//Compile all objects ---
		var result ={};
		result['SingularData'] = {  
									'Summary': summary, 
									'Test_Results': test_results, 
									'System_Resources': system_resources, 
									'JVM': jvm
								};
		res.send(result);

	});
	
}
























