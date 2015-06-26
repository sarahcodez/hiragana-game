var app = angular.module('main');

app.service('httpService', function($http, $q) {

	var BASE_URL = 'http://localhost:8080'; //change later
	var URL_GAME = '/game';
	var URL_USER = '/user';

	this.addGame = function(game) {
		var deferred = $q.defer();
		$http.post(BASE_URL + URL_GAME, game).success(function(data) {
			deferred.resolve(data);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}; //end addGame

	this.getGames = function() {
		var deferred = $q.defer();
		$http.get(BASE_URL + URL_GAME).success(function(data) {
			console.log(data);
			deferred.resolve(data);
		}).error(function (err) {
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	}; //end getGames

	//need a getUser (single) function

	this.getUsers = function() {
		var deferred = $q.defer();
		$http.get(BASE_URL + URL_USER).success(function(data) {
			console.log(data);
			deferred.resolve(data);
		}).error(function (err) {
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	}; //end getUsers

	this.createUser = function(user) {
		var deferred = $q.defer();
		$http.post(BASE_URL + URL_USER, user).success(function(data) {
			console.log(data);
			deferred.resolve(data);
		}).error(function (err) {
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	}; //end createUser

});