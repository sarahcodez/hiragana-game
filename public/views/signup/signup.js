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

		if(validated($scope.username) && validated($scope.password)) {
			authService.createUser($scope.username, $scope.password).then(onSignUp, failedSignup);
		} else {
			$scope.message = "Only letters (lower or upper case) and numbers can be used for usernames and passwords."
			$scope.messageClass = 'danger';
		}

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

	var validated = function(string) {
		if ( !/^[a-zA-Z0-9]+$/.test(string) ) {
			return false;
		} else {
			return true;
		}
	};

});