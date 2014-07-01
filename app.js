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
app.get('/', function(req, res){
	res.render('index');
});
app.get('/report', function(req, res){
	res.render(report);
});

app.get('/builds', function(req, res){
	res.render('builds');
});

app.get('/graph', function(req, res){
	res.render('graph');
});

//GET all the job names
app.get('/retrieveJobs', routings.getJobNames);

//GET all the build names
app.get('/retrieveBuilds/', routings.getBuildNames);

//GET a specific set of data using the following inputs:
//	-job = name of job
//  -id  = name of build
//  -type = type of data
app.get('/data/', routings.getData);

















