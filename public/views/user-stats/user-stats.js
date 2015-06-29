var app = angular.module('main.userstats', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/user-stats', {
			controller: 'userStatsCtrl',
			templateUrl: 'views/user-stats/user-stats.tpl.html'
		});
});

app.controller('userStatsCtrl', function ($scope, dataService, httpService) {

	//if the user was already logged in when clicked saved game, game is saved and there should be a gameId;
	//if there is no gameId but there is a gameObj, add it (user just logged in);

	console.log('Log in status: ' + dataService.loggedIn);
	var gameId = dataService.gameId;
	console.log('gameId: ' + gameId); //dependent on whether user was logged in before game
	var userId = dataService.userId;
	console.log('userId: ' + userId); //should already exist every time
	console.log('Game object: ');
	console.log(dataService.gameObj);
	console.log('User object: ');
	var userObj = dataService.userObj;
	var gameObj = dataService.gameObj;
	var gameProp = Object.keys(gameObj).length;
	console.log(userObj);
	console.log(gameObj);
	console.log(gameProp);
	console.log(gameId.length);

	var gameIds = userObj.games;
	var userGames = [];


	$scope.page = 'User Stats';

	$scope.user = {};

	$scope.userName = userObj.username;

	$scope.userGames = userGames.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.date) - new Date(a.date);
});
;

	$scope.gameType = '';

	function updateUser(newUserObj) {

		var id = userId;
		console.log(id);
		var user = newUserObj;
		console.log(user);

		httpService.updateUser(id, user).then(function (data) {
			console.log('Update success!');
			console.log(data);
			}, function (err) {
				console.log(err);
			});

	}

	function getUserGames(gameArray) {

		for(var i = 0; i < gameArray.length; i++) {

			var gameId = gameArray[i];
			console.log(gameId);

			httpService.getGame(gameId).then(function (game) {

				console.log(game);
				userGames.push(game);

			}, function (err) {
				console.log(err);
			});

		}

		// return $scope.userGames;

	}

	// function getGames (gameIdArray) {

	// 	var gameIds = gameIdArray;

	// 	var gameData = [];

	// 	for(var i = 0; i < gameIds.length; i++) {

	// 		var gameId = gameIds[i];
	// 		console.log(gameId);

	// 		httpService.getGame(gameId).then(function(data) {

	// 			console.log(data);
	// 			gameData.push(data);

	// 		}, function(err) {
	// 			console.log(err);
	// 		});

	// 	}

	// 	return gameData;
	// }


	if ( gameId.length === 0 && gameProp > 0 ) {

		httpService.addGame(gameObj).then(function (data) {

			console.log(data);
			gameId = data._id;
			userObj.games.push(gameId);
			console.log(userObj);
			return userObj;

		}, function (err) {

			console.log(err);

		}).then(function (newUser) { //updateUser

			gameIds = newUser.games;
			console.log(newUser);
			updateUser(newUser);
			console.log(gameIds);
			getUserGames(gameIds);
			console.log($scope.userGames);

		}, function (err) {

			console.log(err);

		}).then(function () {

			dataService.gameId = "";
			gameId = "";

		}, function (err) {

			console.log(err);

		});

	} else if (gameId.length > 0) {

		userObj.games.push(gameId);
		gameIds = userObj.games;

		updateUser(userObj);
		getUserGames(gameIds);

	} else { //no new game or gameId for updating

		getUserGames(gameIds);

	}

});