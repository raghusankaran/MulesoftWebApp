
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
	update: urlPath +'update?job=',
	testFilesPath: "/mnt/nfsshare/SLAS/",
	getTestMetrics: urlPath+ 'getTestMetrics/?job=',
	//Form~~
	putJobTest: urlPath+ "putTestFile/?job=",
	deleteJobTest: urlPath+"deleteJobTest?job=",
	//Query: JOB & IDofBaseline
	updateBaseline: urlPath+"updateBaseline?job=",
	jobHost: 'http://mule-perflab06.managed.contegix.com:8080',
	test: urlPath + 'testing',
	getParsedData: urlPath+'getParsedData/?jobName='
};

module.exports.config = config;
