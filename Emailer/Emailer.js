var fs = require('fs');
var request = require('request');

var username = "naseem.alnaji";
var password = "1325842Naseem";
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function newBuildExists(){
	//Check for new builds
	var url = "http://mule-perflab06.managed.contegix.com:8080/job/PERF_CI/api/json?tree=builds[number,url]";
	

	var builds = getRequestWithAuth(url, username, password);

	var current = fs.readFileSync('history.txt'); //Get current by accessing filesystem

	if(builds[0].number != current){
		fs.writeFileSync('history.txt', builds[0].number);
		return true;
	}
	else
		return false;
}

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mulesoftreporter@gmail.com',
        pass: 'anypoint'
    }
});

function getRequest(url){
	return new Promise(function (fulfill, reject){
		request(
	    {
	        url : urlToHudson	        
	    },
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		        	var info = JSON.parse(body);
		  			fulfill(info);
				}
				else
					reject(error);
		    }
		);			
	}).then(function(res){
		return res;
	});	
}
function getRequestWithAuth(urlDest,user,pass){
	return new Promise(function (fulfill, reject){
		var authorize = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
		request(
	    {
	        url : urlDest,
	        headers : {
            	"Authorization" : authorize
        	}	        
	    },
		    function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		        	console.log(body);
		        	var info = JSON.parse(body);
		  			fulfill(info);
				}
				else{

					reject(error);
				}
					
		    }
		);			
	}).then(function(res){
		return res;
	});
}
function sleep(seconds, callback) {
	var millis = seconds * 1000;
    setTimeout(function(){
    	callback(); 
    }, millis);
}

function slaResults(slaObj, target){
	var resultObj = {};
	resultObj['overall'] = true;
	for(var key in slaObj){
		if(slaObj.hasOwnProperty(key)){	
			var type = key.substring(key.indexOf('(')+1, key.indexOf(')')).replace(/\s/g, '_');
			var dataID = key.substring(key.indexOf(')')+2).replace(/\s/g,'_');
			var min = parseFloat(slaObj[key][0]);
			var max = parseFloat(slaObj[key][1]);

			var data = null;
			var jobResult = -1;

			var displayMetric = key+': '; //display
			if(type == 'System_Resources'){
				var serverResults = [];
				for(var metric in target['SingularData']['System_Resources']){
					if(target['SingularData']['System_Resources'].hasOwnProperty(metric)){
						var metricID = metric.substring(metric.indexOf(':')+1);
						if(metricID == dataID)
							serverResults.push(target['SingularData']['System_Resources'][metric][0]);
					}
				}
				if(serverResults.length == 2){
					jobResult = Math.max(parseFloat(serverResults[0]),parseFloat(serverResults[1]));
				}
				else
					jobResult = parseFloat(serverResults[0]);
			}
			else{
				if(target['SingularData'][type][dataID] != null)
					jobResult = parseFloat(target['SingularData'][type][dataID][0]);
				else
					jobResult = -1;
			}
			var answer = jobResult + '';

			if(min <= jobResult && jobResult <= max){
				resultObj[displayMetric] = [answer, true];
			}
			else{
					
				if(jobResult == -1 || answer == 'NaN')
					answer = 'Not Configured';

				resultObj[displayMetric] = [answer, false];
				resultObj['overall'] = false;
			}
		}

	}
	return resultObj;
}
function getSLARequirements(jobName){
	var url = 'http://mule-perflab06.managed.contegix.com:8880/getTestMetrics/?job=' + jobName;
	return getRequestWithAuth(url, username, password);
}
function main(){

		

		if(newBuildExists){
			//get build results
			var current = fs.readFileSync('history.txt');

			var url = "http://mule-perflab06.managed.contegix.com:8880/getParsedData?id=" + current + "&jobName=PERF_CI";
			var perfJobs = getRequestWithAuth(url, username, password);
			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: 'Performance Reporter <performancereporter@mulesoft.com>', // sender address
			    to: 'naseem.alnaji@mulesoft.com, wai.ip@mulesoft.com', // list of receivers
			    subject: 'Performance Report', // Subject line			    
			    html: '<p><b>Performance Report:</b></p>' // html body
			};
			//Store results here:
			var results = [];

			//sla check it
			for(var job in perfJobs){
				if(perfJobs.hasOwnProperty(job)){
					var requirements = getSLARequirements(job);
					results.push(	{
									  'jobName': job, 
									  'result': slaResults(requirements, perfJobs[job])
									}
							);

				}
			}

			for(var i=0; i<results.length; i++){
				if(results[i]['result']['overall']){
					mailOptions.html += results[i]['jobName'] + ' <b>PASSED</b> the SLA Check: ';
				}
				else{
					mailOptions.html += results[i]['jobName'] + ' <b>FAILED</b> the SLA Check: ';					
				}
				mailOptions.html += '<ul>';

				for(var metric in results[i]['result']){
					if(results[i]['result'].hasOwnProperty(metric) && metric != 'overall'){
						mailOptions.html+= '<li>';
						if(results[i]['result'][metric][1] == true){
							mailOptions.html += metric +' '+ results[i]['result'][metric][0] + ' (PASSED)'
						}
						else{
							mailOptions.html += metric +' '+ results[i]['result'][metric][0] + ' (FAILED)'
						}
						mailOptions.html+= '</li>';
					}
				}
				mailOptions.html += '</ul>';
			}

			//email results
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			        sleep(30, main);
			    }else{
			        console.log('Message sent: ' + info.response);
			        sleep(30, main);
			    }

			});

			
		}

		else{
			sleep(30, main);
		}
	
}

main();
