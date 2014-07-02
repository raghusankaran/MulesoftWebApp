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

	console.log('trying to connect to Hudson: ' + config.jobHost);
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
				console.log(dList);
				res.send(dList);
			}
	    }
	);	
};

//GET builds in order of timestamp
exports.getRecentJobs = function(req, res){
	var dList = "";

	console.log('trying to connect to Hudson: ' + config.jobHost);
	var urlToHudson = config.jobHost + '/api/json?tree=jobs[name,lastSuccessfulBuild[number,timestamp]]';

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


	  			while(info.jobs.length != 0){
	  				var timestamp = info.jobs[0].lastSuccessfulBuild.timestamp;
	  				var id = info.jobs[0].lastSuccessfulBuild.number;
	  				var name = info.jobs[0].name;
	  				var index = 0;
	  				console.log(''+ timestamp + ', name: ' + name);
		  			for(var i=0; i < info.jobs.length; i++){		  				
		  				if(timestamp < info.jobs[i].lastSuccessfulBuild.timestamp)
		  				{
		  					timestamp = info.jobs[i].lastSuccessfulBuild.timestamp;
			  				id = info.jobs[i].lastSuccessfulBuild.number;
			  				name = info.jobs[i].name;
			  				index = i;
		  				}
		  			}
		  			data[data.length] = {'timestamp': timestamp, 'id': id,'name': name};
		  			info.jobs.splice(index,index);
		  		}
	  			

				console.log(data);
				res.send(data);
			}
	    }
	);	
};

//GET all the build names
exports.getBuildNames = function(req, res){ 
	var buildName = req.query.build;

	var dList = "";
	var urlToHudson = config.jobHost + '/job/'+ buildName + '/api/json'

	console.log('trying to connect to Hudson: ' + urlToHudson);


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
	        	console.log(body);
	        	var info = JSON.parse(body);

	  			for(var i=0; i < info.builds.length; i++){
					dList += info.builds[i].number +',';
				}
				console.log(dList);
				res.send(dList);
			}
	    }
	);

	// var path = config.hudsonPath+ buildName+'/builds/';
	// fs.readdir(path, function(err, files){
	// 	if(err){
	// 		throw err;
	// 	}

	// 	for(var i=0; i < files.length; i++){
	// 		if(fs.lstatSync(path+files[i]).isDirectory()){
				
	// 			dList += files[i] + ",";
	// 		}
	// 	}

	// 	res.send(dList);

	// });
	
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
	    	console.log('woihfqwf');
	        if (!error && response.statusCode == 200) {
	        	var info = JSON.parse(body);	  			
				fileID = info.id;		
			
	    	
				var path = config.hudsonPath+job+'/builds/'+fileID+'/archive/logs/';


				if(type == 'cpu')
				{	
					var nameOfFile = 'sar.cpuusage.out';
					console.log(path+nameOfFile);
					fs.readFile(path+nameOfFile, {encoding: 'utf-8'}, function(err, str)
					{
						console.log(path + nameOfFile);
						console.log(str);
						console.log(err);
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
				else if(type == 'memutil')
				{	
					var nameOfFile = 'sar.memutil.out';
					console.log(path + nameOfFile);
					fs.readFile(path + nameOfFile, {encoding: 'utf-8'}, function(err, str)
					{			
						var temp  = str.match(/\s\d{1,}\.\d{2}/g);
					    var data = '';
						for(var i = 0; i < temp.length; i+=2){
							
							data += temp[i]+',';
							
						}
						res.send(data);
					});
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
					console.log('NO DATA TO SEND?');
				}
			}
	});

};
