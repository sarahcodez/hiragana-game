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


