var app = angular.module('main', ['ngRoute', 'main.hiragana', 'main.login', 'main.signup', 'main.userstats']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/hiragana'
		})
		.otherwise({
			redirectTo: '/hiragana'
		});
});

app.controller('navbarCtrl', function($scope, $location, dataService, httpService){
    
    $scope.loggedIn = dataService.loggedIn;
    $scope.userName = dataService.userObj.username;

});

//Big thanks to teacher spentak for preparing an Angular/Express authentication seed 
//(used in this application) and to teacher erik-slack for providing an example of 
//how to implement it
//Authentication seed: https://github.com/CodingCampus/angular-express-auth-seed
//Implementation example: https://github.com/erik-slack/Professional-Portfolio/