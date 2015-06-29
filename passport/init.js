var login = require('./login');
var signup = require('./signup');

// var User = require('../model/user');
// var User = require('../model/user');
var Models = require('../model/models');
var User = Models.User;
//var Game = Models.Game;

module.exports = function (passport) {

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function (user, done) {
		console.log('serializing user: ');
		console.log(user);
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			console.log('deserializing user:', user);
			done(err, user);
		});
	});

	login(passport);
	signup(passport);
}