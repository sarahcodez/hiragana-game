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
		if(validated($scope.username) && validated($scope.password)) {
			authService.login($scope.username, $scope.password).then(onLogin, failedLogin);
		} else {
			$scope.message = "Only letters (lower or upper case) and numbers can be used for usernames and passwords."
			$scope.messageClass = 'danger';
		}
	};

	var onLogin = function (data) {
		dataService.userId = data.id;
		dataService.loggedIn = true;
		dataService.userObj = data;
		$location.path('/user-stats');
		console.log(data);
		//$scope.message = data.message;
		//$scope.messageClass = 'success';
	};

	var failedLogin = function (err) {
		console.log(err);
		$scope.message = 'Don\'t have an account yet? Click \"Create New Account\" below.';
		//$scope.message = err;
		$scope.messageClass = 'danger';
	};

	var validated = function(string) {
		if ( !/^[a-zA-Z0-9]+$/.test(string) ) {
			return false;
		} else {
			return true;
		}
	};

});