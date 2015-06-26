//Each schema is associated with a MongoDB collection
//and is a template of how each document in the collection will look
//To add new instances to the collection and update and delete them,
//register the schema with mongoose and make a model (end)

var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
	type: String,
	guessed: Array,
	reviewDeck: Array,
	masteryDeck: Array,
	reviewMode: Boolean,
	gameId: Number,
	date: Date,
	total: Number //could figure this out based on reviewMode + reviewDeck and type
});

var UserSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	games: [{type: mongoose.Schema.Types.ObjectId, ref: 'game'}] //type of reference is the unique mongoose Object Id --use that to reference and connect
});

exports.Game = mongoose.model('game', GameSchema); //check
exports.User = mongoose.model('user', UserSchema);

// when include in file, set it equal to variable, then refer to schema as XXX.users, etc.
