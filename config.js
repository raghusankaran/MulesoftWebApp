
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
	ranges: urlPath +'ranges?job=',
	testFilesPath: "/mnt/nfsshare/SLAS/",
	getTestMetrics: urlPath+ 'getTestMetrics/?job=',
	//Form~~
	putJobTest: urlPath+ "putTestFile/?job=",
	deleteJobTest: urlPath+"deleteJobTest?job=",
	//Query: JOB & IDofBaseline
	updateBaseline: urlPath+"updateBaseline?job=",
	jobHost: 'http://mule-perflab06.managed.contegix.com:8080',
	test: urlPath + 'testing',
	getParsedData: urlPath+'getParsedData/?jobName=',
	getBuildsByDescription: urlPath+'getBuildsByDescription/?build=',
	getTestOptions: urlPath+'getTestOptions/',
	addTestOption: urlPath+'addTestOption?job=',
	deleteTestOption: urlPath+'deleteTestOption?job=',
	users: "/mnt/nfsshare/dashboardUserList.txt"
};

exports.config = config;
