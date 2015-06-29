var app = angular.module('main.userstats', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/user-stats', {
			controller: 'userStatsCtrl',
			templateUrl: 'views/user-stats/user-stats.tpl.html'
		});
});

app.controller('userStatsCtrl', function ($scope, dataService, httpService) {

	$scope.page = 'User Stats';

	$scope.user = {};

	$scope.userName = '';

	$scope.userGames = [];

	$scope.gameType = '';

	var gameId = dataService.gameId;
	console.log(gameId);
	var userId = dataService.userId;
	console.log(userId);

	//var userGameIds = []; //558cb314ca1595cb165e1f81

	//var userId = '558cb314ca1595cb165e1f80';

	$scope.getUser = function () {

		httpService.getUser(userId).then(function (data) {

			console.log(data);
			console.log(data.games);
			$scope.user = data; //may not need this
			userGameIds = data.games;
			console.log($scope.user);
			console.log(userGameIds);

			$scope.userName = data.username;

			return data.games;

		}, function(err) {

			console.log(err);

		}).then(function(games) {

			console.log(games);
			$scope.userGames = getGames(games);

		});

	};

	function getGames (gameIdArray) {

		var gameIds = gameIdArray;

		var gameData = [];

		for(var i = 0; i < gameIds.length; i++) {

			var gameId = gameIds[i];
			console.log(gameId);

			httpService.getGame(gameId).then(function(data) {

				console.log(data);
				gameData.push(data);

			}, function(err) {
				console.log(err);
			});

		}

		return gameData;
	}

});