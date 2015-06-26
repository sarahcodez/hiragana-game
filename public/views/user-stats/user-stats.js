var app = angular.module('main.userstats', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/user-stats', {
			controller: 'userStatsCtrl',
			templateUrl: 'views/user-stats/user-stats.tpl.html'
		});
});

app.controller('userStatsCtrl', function($scope) {

});