var urlPath = "http://mule-perflab06.managed.contegix.com:8880/";
var hudsonPath = "/home/perftest/.hudson/jobs";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//url to our app
module.exports.urlPath = urlPath;

//path to hudson's jobs directory
module.exports.hudsonPath = hudsonPath

//Get job names
module.exports.retrieveJobs = urlPath + 'retrieveJobs/';

//get build names
module.exports.retrieveBuilds = urlPath + 'retrieveBuilds/?build=';

//get data
module.exports.retrieveData = urlPath + 'data/';
