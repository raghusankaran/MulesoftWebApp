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
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


app.use(express.bodyParser());
app.use(app.router);

//LOGIN CHECKER
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.render('login');
  } else {
    next();
  }
}

app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user === 'john' && post.password === 'johnspassword') {
    req.session.user_id = johns_user_id_here;
    res.redirect('/');
  } else {
    res.send('Bad user/pass');
  }
});

app.get('/', checkAuth, function(req, res){
	
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

app.get('/muledir', function(req, res){
	res.render('muledir');
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

app.get('/getTestOptions', routings.getTestOptions);
//GET a specific set of data using the following inputs:
//	-job = name of job
//  -id  = name of build
//  -type = type of data
//app.get('/data/', routings.getData);

app.post('/addTestOption', routings.addTestOption);

app.post('/deleteTestOption', routings.deleteTestOption);
//GET ordered list of job names
app.get('/getRecentJobs/', routings.getRecentJobs);

app.get('/getParsedData', routings.getParsedData);
app.get('/getBuildsByDescription', routings.getBuildsByDescription);

















