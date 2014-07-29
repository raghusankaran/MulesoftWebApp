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
    req.session.user_id = 'john';
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/');
});

app.get('/', checkAuth, function(req, res){
	
	res.render('home');
});
app.get('/report', checkAuth, function(req, res){
	res.render('report');
});

app.get('/builds',checkAuth, function(req, res){
	res.render('builds');
});
app.get('/home', checkAuth, function(req, res){
	res.render('home');
});
app.get('/graph',checkAuth, function(req, res){
	res.render('graph');
});

app.get('/update',checkAuth, function(req, res){
	res.render('update');
});

app.get('/muledir', function(req, res){
	res.render('muledir');
});

//delete test metric
app.get('/deleteJobTest',checkAuth, routings.deleteJobTest);

//put test file
app.post('/putTestFile',checkAuth, routings.addJobTest);

//GET all the job names
app.get('/retrieveJobs',checkAuth, routings.getJobNames);

//GET the test metrics for a job
app.get('/getTestMetrics',checkAuth, routings.getTestMetrics);


app.get('/updateBaseline', checkAuth,routings.updateBaseline);
//GET all the build names
app.get('/retrieveBuilds/',checkAuth, routings.getBuildNames);

app.get('/getTestOptions', checkAuth,routings.getTestOptions);
//GET a specific set of data using the following inputs:
//	-job = name of job
//  -id  = name of build
//  -type = type of data
//app.get('/data/', routings.getData);

app.post('/addTestOption',checkAuth, routings.addTestOption);

app.post('/deleteTestOption', checkAuth,routings.deleteTestOption);
//GET ordered list of job names
app.get('/getRecentJobs/',checkAuth, routings.getRecentJobs);

app.get('/getParsedData',checkAuth, routings.getParsedData);
app.get('/getBuildsByDescription',checkAuth, routings.getBuildsByDescription);

















