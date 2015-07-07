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
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	};

	this.updateUser = function(id, user) {
		var deferred = $q.defer();
		$http.put(BASE_URL + URL_USER + '/' + id, user).success(function(data) {
			deferred.resolve(data);
		}).error(function (err) {
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	};

	this.getGame = function(id) {
		var deferred = $q.defer();
		$http.get(BASE_URL + URL_GAME + '/' + id).success(function(data) {
			console.log(data);
			deferred.resolve(data);
		}).error(function (err) {
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	};

	// this.getGames = function() {
	// 	var deferred = $q.defer();
	// 	$http.get(BASE_URL + URL_GAME).success(function(data) {
	// 		console.log(data);
	// 		deferred.resolve(data);
	// 	}).error(function (err) {
	// 		console.log(err);
	// 		deferred.reject(err);
	// 	});

	// 	return deferred.promise;
	// };

	// this.getUsers = function() {
	// 	var deferred = $q.defer();
	// 	$http.get(BASE_URL + URL_USER).success(function(data) {
	// 		console.log(data);
	// 		deferred.resolve(data);
	// 	}).error(function (err) {
	// 		console.log(err);
	// 		deferred.reject(err);
	// 	});

	// 	return deferred.promise;
	// };

	// this.createUser = function(user) {
	// 	var deferred = $q.defer();
	// 	$http.post(BASE_URL + URL_USER, user).success(function(data) {
	// 		console.log(data);
	// 		deferred.resolve(data);
	// 	}).error(function (err) {
	// 		console.log(err);
	// 		deferred.reject(err);
	// 	});

	// 	return deferred.promise;
	// };

	// this.getUser = function(id) {
	// 	var deferred = $q.defer();
	// 	$http.get(BASE_URL + URL_USER + '/' + id).success(function(data) {
	// 		console.log(data);
	// 		deferred.resolve(data);
	// 	}).error(function (err) {
	// 		console.log(err);
	// 		deferred.reject(err);
	// 	});

	// 	return deferred.promise;
	// };

});