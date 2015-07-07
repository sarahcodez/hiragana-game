/***************************************************************************
    These routes are API routes only - meaning this project seed
    is not built to manage ui/pages for an entire website. It is set
    up to deliver the initial HTML page, and then the Angular app
    should handle all routes after that point. Any route that requires
    that the user be authenticated before using that endpoint should
    use the isAuthenticated middleware in this file  
***************************************************************************/

var express = require('express');
var router = express.Router();
var debug = require('debug')('dev');

var Models = require('../model/models');
var User = Models.User;
var Game = Models.Game;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {		
		return next();
	} else {
		// if the user is not authenticated then redirect him to the login page
		res.json('Unauthorized user. Please first log in.');
	}
}

module.exports = function (passport) {

	/* GET login or main page. Does NOT require authentication */
	router.get('/', function (req, res) {
		// The main page to display
		debug('GET: index.html');
		res.render('index.html');
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login'), function (req, res) {
		res.send({ id: req.user.id, username: req.user.username, games: req.user.games, message: "Successfully logged in" });
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup'), function (req, res) {
		res.send({ id: req.user.id, username: req.user.username, games: req.user.games, message: "Successfully logged in" });
	});

	/* PUT ALL YOUR OTHER ROUTES HERE */
	//    router.get('/item', isAuthenticated, function (req, res) {
	//        res.json('get items from database');
	//    });

	//Authenticate game post request to access user-stats page
	router.post('/game', isAuthenticated, function (req, res) {

		var newGame = new Game(req.body);
		newGame.save(function (err, savedItem) {

			if(err) {
				res.send({ error: err });
			} else {
				res.send(savedItem);
			}
			
		});
	});

	router.put('/user/:id', isAuthenticated, function (req, res) {
		var id = req.params.id;
		User.findOne({_id: id}, function (err, user) {
			for (var key in req.body) {
				user[key] = req.body[key];
			}
			user.save();
			res.send(user);
		});
	});

	router.get('/game/:id', isAuthenticated, function (req, res) {
		var id = req.params.id;
		Game.findOne({_id: id}, function (err, game) {

			if(err) {
				res.status(401).send('Error looking up games');
			} else {
				res.send(game);
			}

		});
	});

	// router.get('/game', function(req, res) {
	// 	Game.find({}, function(err, games) {

	// 		if(err) {
	// 			res.status(401).send('Error looking up games');
	// 		} else {
	// 			res.send(games);
	// 			console.log(games);
	// 		}

	// 	});
	// });

	

	router.put('/game/:id', isAuthenticated, function(req, res) {
		var id = req.params.id;
		Game.findOne({_id: id}, function(err, game) {

			if(err) {
				res.send(err);
			} else {
				for (var key in req.body) {
					game[key] = req.body[key];
				}
				game.save();
				res.send(game);
			}

		});
	});

	router.delete('/game/:id', isAuthenticated, function(req, res) {
		var id = req.params.id;
		Game.findOne({_id: id}, function(err, game) {
			game.remove(function(err) {
				if(err) {
					res.send(err);
				} else {
					res.send('Success');
				}
			});
		});
	});

	// router.get('/user', function(req, res) {
	// 	User.find({}, function(err, users) {
	// 		if(err) {
	// 			res.status(401).send('Error looking up users');
	// 		} else {
	// 			res.send(users);
	// 			console.log(users);
	// 		}
	// 	});
	// });

	router.get('/user/:id', isAuthenticated, function(req, res) {
		var id = req.params.id;
		User.findOne({_id: id}, function(err, user) {

			if(err) {
				res.status(401).send('Error looking up user');
			} else {
				res.send(user);
			}

		});
	});

	router.post('/user', function(req, res) {
		var newUser = new User(req.body);
		newUser.save(function (err, savedItem) {
			res.send({
				msg: "Success",
				body: savedItem
			});
		});
	});


	router.delete('/user/:id', isAuthenticated, function(req, res) {
		var id = req.params.id;
		User.findOne({_id: id}, function(err, user) {
			user.remove(function(err) {
				if(err) {
					res.send(err);
				} else {
					res.send('Success');
				}
			});
		});
	});

	//Test route
	// router.get('/items', isAuthenticated, function (req, res) {
	// 	res.json(["car", "bank", "toy", "dog"]);
	// });


	/* Handle Logout */
	router.get('/signout', function (req, res) {
		req.logout();
		res.redirect("/");
	});

	return router;
}