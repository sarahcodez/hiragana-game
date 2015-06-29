var app = angular.module('main.login', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/login', {
			controller: 'loginCtrl',
			templateUrl: 'views/login/login.tpl.html'
		});
});

app.controller('loginCtrl', function ($scope, $location, authService, dataService, httpService) {

	$scope.username = "";
	$scope.password = "";

	$scope.loginBtnClicked = function () {
		authService.login($scope.username, $scope.password).then(onLogin, failedLogin);
	};

	var onLogin = function (data) {
		dataService.userId = data.id; 
		//check if there is a completed game Obj in data service
		//if so, save game Obj and pass id to data service
		$location.path('/user-stats');
		console.log(data);
		//$scope.message = data.message;
		//$scope.messageClass = 'success';
	};

	var failedLogin = function (err) {
		console.log(err);
		$scope.message = err;
		$scope.messageClass = 'danger';
	};
});