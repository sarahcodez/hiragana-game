var express = require('express');
var app = express();
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/hiragana-game'); //name of database
var bodyParser = require('body-parser');
var path = require('path');

var Models = require('./model/models');
var User = Models.User;
var Game = Models.Game;

app.use(express.static(path.join(__dirname + '/public')));
app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var firstUser = new User({username: 'KanaNinja001', password: 'xxxxx', email: 'example@email.com'});

// firstUser.save(function(err, user) {
// 	console.log(err);
// 	console.log(user);
// });

var firstGame = new Game({type: 'hiragana-sound', masteryDeck: [{
	animated: "images/stroke-order/Hiragana_う_stroke_order_animation.gif", 
	disabled: false,
	id: "u",
	image: "images/hiragana/hiragana-u.png",
	name: "う",
	sound: "audio/tjp/hira-u.mp3"
}], });

// firstGame.save(function(err, game) {
// 	console.log(err);
// 	console.log(game);
// 	firstUser.games.push(game);
// 	firstUser.save();
// });

firstGame = new Game({type: 'hiragana-sound', masteryDeck: [{
	animated: "images/stroke-order/Hiragana_い_stroke_order_animation.gif", 
	disabled: false,
	id: "i",
	image: "images/hiragana/hiragana-i.png",
	name: "い",
	sound: "audio/tjp/hira-i.mp3"
}], });

// firstGame.save(function(err, game) {
// 	console.log(err);
// 	console.log(game);
// 	firstUser.games.push(game);
// 	firstUser.save(function(err, user) {
// 		console.log(err);
// 		console.log('This is the last one: ', user);
// 	});
// });

//changed routes from /games and /users to singular form

app.get('/game', function(req, res) {
	Game.find({}, function(err, games) {

		if(err) {
			res.status(401).send('Error looking up games');
		} else {
			//console.log('users', users);
			res.send(games);
			console.log(games);
		}

	});
});

app.get('/game/:id', function(req, res) {
	var id = req.params.id;
	Game.findOne({_id: id}, function(err, game) {

		if(err) {
			res.status(401).send('Error looking up games');
		} else {
			res.send(game);
		}

	});
});

app.post('/game', function(req, res) {
	var newGame = new Game(req.body);
	newGame.save(function(err, savedItem) {
		res.send({
			msg: "Success",
			body: savedItem
		});
	});
});

app.put('/game/:id', function(req, res) {
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

app.delete('/game/:id', function(req, res) {
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

app.get('/user', function(req, res) {
	User.find({}, function(err, users) {
		if(err) {
			res.status(401).send('Error looking up users');
		} else {
			//console.log('users', users);
			res.send(users);
			console.log(users);
		}
	});
});

app.get('/user/:id', function(req, res) {
	var id = req.params.id;
	User.findOne({_id: id}, function(err, user) {

		if(err) {
			res.status(401).send('Error looking up user');
		} else {
			res.send(user);
		}

	});
});

app.post('/user', function(req, res) {
	var newUser = new User(req.body);
	newUser.save(function (err, savedItem) {
		res.send({
			msg: "Success",
			body: savedItem
		});
	});
});

app.put('/user/:id', function(req, res) {
	var id = req.params.id;
	User.findOne({_id: id}, function(err, user) {
		for (var key in req.body) {
			user[key] = req.body[key];
		}
		user.save();
		res.send(user);
	});
});

app.delete('/user/:id', function(req, res) {
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

app.listen(8080);
console.log('Connected to server');