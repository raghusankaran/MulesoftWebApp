var urlPath = "http://mule-perflab06.managed.contegix.com:8880/";
var hudsonPath1 = "/home/perftest/.hudson/jobs";

var config = {
	url: "http://mule-perflab06.managed.contegix.com:8880/",
	hudsonPath: "/home/perftest/.hudson/jobs/",
	retrieveJobs: urlPath+ 'retrieveJobs/',
	retrieveBuilds: urlPath + 'retrieveBuilds/?build=',
	retrieveData: urlPath + 'data/'
};

module.exports.config = config;