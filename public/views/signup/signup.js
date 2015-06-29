var app = angular.module('main.signup', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/signup', {
			controller: 'signupCtrl',
			templateUrl: 'views/signup/signup.tpl.html'
		});
});

app.controller('signupCtrl', function ($scope, $location, authService, dataService, httpService) {
	$scope.username = "";
	$scope.password = "";
	$scope.confirmPassword = "";

	$scope.signUpBtnClicked = function () {
		authService.createUser($scope.username, $scope.password).then(onSignUp, failedSignup);
	};

	var onSignUp = function (data) {
		dataService.userId = data.id;
		dataService.loggedIn = true;
		dataService.userObj = data;
		$location.path('/user-stats');
		console.log(data);
	};

	var failedSignup = function (err) {
		console.log(err);
		$scope.message = err;
		$scope.messageClass = 'danger';
	};

});