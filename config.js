
var urlPath = 'http://mule-perflab06.managed.contegix.com:8880/';
//LOCAL

var config = {
	url: "http://mule-perflab06.managed.contegix.com:8880/",
	hudsonPath: "/home/perftest/.hudson/jobs/",
	retrieveJobs: urlPath+ 'retrieveJobs/',
	retrieveBuilds: urlPath + 'retrieveBuilds/?build=',
	retrieveData: urlPath + 'data/',
	retrieveRecentJobs: urlPath + 'getRecentJobs/',
	jobHost: 'http://mule-perflab06.managed.contegix.com:8080'

};

module.exports.config = config;




// var urlPath = "http://mule-perflab06.managed.contegix.com:8880/";
// var hudsonPath1 = "/home/perftest/.hudson/jobs";
// var config = {
// 	url: "http://mule-perflab06.managed.contegix.com:8880/",
// 	hudsonPath: "/home/perftest/.hudson/jobs/",
// 	retrieveJobs: urlPath+ 'retrieveJobs/',
// 	retrieveBuilds: urlPath + 'retrieveBuilds/?build=',
// 	retrieveData: urlPath + 'data/',
// 	jobHost: 'http://mule-perflab06.managed.contegix.com:8080/api/json'
// };

// module.exports.config = config;