var app = angular.module('main', ['ngRoute', 'main.hiragana', 'main.userstats']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/hiragana'
		})
		.otherwise({
			redirectTo: '/hiragana'
		});
});