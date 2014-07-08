var fs = require('fs');
var paths = require('../config');
var config = paths.config;
var request = require('request');

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
	
	var filename = req.query.job + '.sla';
	var type = req.query.type;
	path = config.testFilesPath + filename;
	fs.readFile(path, {encoding: 'utf-8'}, function(err, str)
	{
		if(str == null){
			var jsonObj = {
				"sla":{},
				"prev":{},
				"base":{}
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
			console.log(data);
			delete data[type][metricID];
			console.log(data);
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
				"base":{}
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
