
var urlPath = 'http://mule-perflab06.managed.contegix.com:8880/';
//LOCAL

var config = {
	url: "http://mule-perflab06.managed.contegix.com:8880/",
	hudsonPath: "/home/perftest/.hudson/jobs/",
	retrieveJobs: urlPath+ 'retrieveJobs/',
	retrieveBuilds: urlPath + 'retrieveBuilds/?build=',
	retrieveData: urlPath + 'data/',
	retrieveRecentJobs: urlPath + 'getRecentJobs/',
	report: urlPath +'report?jobName=',
	testFilesPath: "/mnt/nfsshare/SLAS/",
	jobHost: 'http://mule-perflab06.managed.contegix.com:8080'

};

module.exports.config = config;
