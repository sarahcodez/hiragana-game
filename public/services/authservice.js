var app = angular.module('main');

app.service('authService', function ($http, $q) {

	var URL_REGISTER = "http://localhost:8080/signup";
	var URL_LOGIN = "http://localhost:8080/login";

	this.createUser = function (username, password) {

		var credents = {
			username: username,
			password: password
		};

		var deferred = $q.defer();
		$http.post(URL_REGISTER, credents).success(function (data) {
			deferred.resolve(data);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	this.login = function (username, password) {
		var credents = {
			username: username,
			password: password
		};

		var deferred = $q.defer();
		$http.post(URL_LOGIN, credents).success(function (data) {
			deferred.resolve(data);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};
});