var express = require('express');
var app = express();
var path = require('path');
var forever = require('forever');
var routings = require('./routes/routings.js');

var hbs = require('hbs');

var fs = require('fs');

app.listen(8880);

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static(__dirname));

app.use(express.bodyParser());
app.use(app.router);

app.get('/', function(req, res){
	console.log('??');
	res.render('home');
});
app.get('/report', function(req, res){
	res.render('report');
});

app.get('/builds', function(req, res){
	res.render('builds');
});
app.get('/home', function(req, res){
	res.render('home');
});
app.get('/graph', function(req, res){
	res.render('graph');
});

app.get('/update', function(req, res){
	res.render('update');
});

//delete test metric
app.get('/deleteJobTest', routings.deleteJobTest);

//put test file
app.post('/putTestFile', routings.addJobTest);

//GET all the job names
app.get('/retrieveJobs', routings.getJobNames);

//GET the test metrics for a job
app.get('/getTestMetrics', routings.getTestMetrics);


app.get('/updateBaseline', routings.updateBaseline);
//GET all the build names
app.get('/retrieveBuilds/', routings.getBuildNames);

//GET a specific set of data using the following inputs:
//	-job = name of job
//  -id  = name of build
//  -type = type of data
//app.get('/data/', routings.getData);

//GET ordered list of job names
app.get('/getRecentJobs/', routings.getRecentJobs);

app.get('/getParsedData', routings.getParsedData);
app.get('/getBuildsByDescription', routings.getBuildsByDescription);















