require('dotenv').config({path: './../envs/dempach-env'});
require('now-logs')(process.env.NOW_LOGS_KEY);

var express = require('express');
var path = require('path');

var archiver = require('./archiver');
var CronJob = require('cron').CronJob;
new CronJob('00 00 22 * * 1', function () {
	archiver();
}, null, true, 'Europe/London');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(require('node-sass-middleware')({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false,
	outputStyle: 'compressed',
	sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
	});
});

app.listen(5000, function () {
  console.log('Listening on port 5000!');
});

module.exports = app;
