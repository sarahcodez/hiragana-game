var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var genuuid = require('uid2');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/hiragana-game'); //name of database
var passport = require('passport');
var passportInit = require('./passport/init');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var routes = require('./routes/routes');
var debug = require('debug')('dev');
var flash = require('connect-flash');

var Models = require('./model/models');
var User = Models.User;
var Game = Models.Game;

app.use(express.static(path.join(__dirname + '/public')));
app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());

app.use(expressSession({
	genid: function (req) {
		return genuuid(62) // use UUIDs for session IDs 
	},
	secret: 'secretkey',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passportInit(passport);
app.use(flash());

app.use('/', routes(passport));

//This is 404 for API requests - UI/View 404s should be 
//handled in Angular
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.set('port', 8080);
var server = app.listen(app.get('port'), function () {
	debug('Express server listening on port ' + server.address().port);
});