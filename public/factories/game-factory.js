var app = angular.module('main'); //check

app.factory('Game', function() {
    
    var game = function() {
        this.type = "";
        this.guessed =[];
        this.reviewDeck = [];
        this.masteryDeck = [];
        this.reviewMode = false;
        this.gameId = null;
        this.date = null;
        this.total = 46;
    }
    
    return game;
});


// app.controller('mainCtrl', function($scope, Game) {
    
//     $scope.currentGame = null;
//     $scope.createNewGame = function() {
//         $scope.currentGame = new Game();
//         $scope.currentGame.type = "SOund Game"
        
//         $http.post('/games',$scope.currentGame);
//     };
    
// });