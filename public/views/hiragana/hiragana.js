
var app = angular.module('main.hiragana', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/hiragana', {
			controller: 'mainCtrl',
			templateUrl: 'views/hiragana/hiragana.tpl.html'
		});
});

app.controller('mainCtrl', function ($scope, $modal, $log, $timeout, $location, $window, $route, $routeParams, dataService, httpService, Game) {
	
	var gameMode = 'home';
	var audio = {}; //kana buttons
	var guessedItems = [];
	var testSound = {};
	var reviewDeck = [];
	var masteryDeck = [];

	var correctSound = new Audio("audio/correct_guess.wav");
	var incorrectSound = new Audio("audio/incorrect_guess.wav");
	var finishSound = new Audio("audio/win_music.wav");

	var unguessedSounds;
	var reviewMode = false;

	$scope.page = 'Hiragana';

	//API functions -- may not need all here

	$scope.users = [];
	$scope.games = [];
	$scope.gameToSave = {};
	$scope.userToSave = {};

	$scope.getUsers = function () {

		httpService.getUsers().then(function (data) {
			$scope.users = data;
		}, function(err) {
			console.log(err);
		});

	};

	$scope.createUser = function() {

		httpService.createUser($scope.userToSave).then(function (data) {
			console.log(data);
		}, function (err) {
			console.log(err);
		});

		$scope.userToSave = {};
	};

	$scope.getGames = function() {

		httpService.getGames().then(function (data) {
			console.log(data);
			//$scope.games = data;
		}, function(err) {
			console.log(err);
		});

	};

	$scope.addGame = function() {

		httpService.addGame($scope.gameToSave).then(function (data) {
			console.log(data);
		}, function (err) {
			console.log(err);
		});

		$scope.gameToSave = {};
	};

	//Factory Code start -- for testing: not yet integrated

	$scope.currentGame = null;

    $scope.createNewGame = function(typeString) {
        $scope.currentGame = new Game();
        $scope.currentGame.type = typeString;
    };

    //Test under kotoba-game:

    // $scope.createNewGame('hiragana-sound');
    // console.log('Here is the result of creating a new game using the factory: ');
    // console.log($scope.currentGame);

	//Factory Code end

	$scope.hiragana = dataService.hiragana;

	$scope.playSoundGame = false;

	$scope.panelImage = '';
	$scope.panelImageShow = false;
	$scope.transparentClass = [];
	$scope.backgroundImg = '';

	$scope.panelMessage = '';
	$scope.panelMessageShow = false;

	$scope.audioIcon = 'images/audioicon.png';
	$scope.highlightClass = [];

	$scope.gameStatsShow = false;

	$scope.roundNumber = 1;
	$scope.roundGuesses = 0;
	$scope.roundTotal = 15;
	$scope.progress = 0;
	$scope.progressLabel = 0;

	$scope.startGame = function(result) {
		
		if(result === true) {

			$scope.gameStatsShow = true; 
			guessedItems = [];
			$scope.roundNumber = 1; 
			$scope.roundGuesses = 0; 
			$scope.roundTotal = 15; 
			$scope.panelMessage = 'Round 1!'; 
			$scope.panelMessageShow = true;
			$timeout(function() {

					$scope.$apply('panelMessageShow = false');
					$scope.playTestSound(guessedItems);
					
				}, 2000);
		}
	};

	$scope.playTestSound = function(guessedArray) {
		var guessedSounds = guessedArray;
		unguessedSounds = getUnguessed(guessedSounds);
		testSound = getRandSound(unguessedSounds);
		$scope.applyHighlight();
		playSound(testSound);
	};

	//Open a modal window to provide an intro and start button for the Sounds Game

	function open () { //rename as soundGameIntro

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'soundGameModal.html',
	      controller: function ($scope, $modalInstance, startGame) {

	      		$scope.ok = function () {
					$modalInstance.close();
				};

				$scope.start = function() {
					// return true;
					startGame(true);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
	      },
	      size: 'md',
	      resolve: { //passes information from main scope to scope for modal
	      	startGame: function() {
	      		return $scope.startGame;
	      	}
	      }
    	});

	    modalInstance.result.then(function () {

	      console.log('Modal success!')
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });

  	}

  	function gameOver () {

  		var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'gameOverModal.html',
	      controller: function ($scope, $modalInstance, startGame, reviewDeck, masteryDeck) {

	      		$scope.reviewNum = reviewDeck.length;
	      		$scope.masteryNum = masteryDeck.length;

	      		$scope.ok = function () {
					$modalInstance.close();
				};

				$scope.start = function() {
					startGame(true);
				};

				$scope.review = function() {
					console.log('Review function called! Review deck: ');
					console.log(reviewDeck);
				}

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
	      },
	      size: 'md',
	      resolve: {
	      	startGame: function() {
	      		return $scope.startGame;
	      	},
	      	reviewDeck: function() {
	      		return reviewDeck;
	      	}, 
	      	masteryDeck: function() {
	      		return masteryDeck;
	      	}
	      }
    	});

	    modalInstance.result.then(function () {
	      console.log('Modal success!')
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });

  	}
	
	$scope.applyHighlight = function() {
		addClass($scope.highlightClass, 'highlighted');
		console.log('This is inside the applyHighlight function. testSound is: ');
		console.log(testSound);
		$timeout(function() {
			$scope.highlightClass.pop(); //refactor as removeClass()
				}, 800);
	};

	$scope.testReplay = function() {
		console.log('testReplay says the location is ' + $location.path() + ' and the gameMode is ' + gameMode);
		console.log(testSound);
		playSound(testSound);

		//refactor as applyHighlight
		addClass($scope.highlightClass, 'highlighted');
		$timeout(function() {
					removeClass($scope.highlightClass);
				}, 800);
	};
	
	$scope.kanaButtonClicked = function(kanaObj) {

		playSound(kanaObj);

		//if ($routeParams.home)
		if (gameMode === 'home') {

			$scope.panelImage = kanaObj.animated;
			$scope.panelImageShow = true;

		} else if (gameMode === 'sound-game') {

			$scope.backgroundImg = kanaObj.image;
			console.log($scope.backgroundImg);
			addClass($scope.transparentClass, 'transparent');
			var result = checkGuess(kanaObj);
			console.log(result);

			if (result === 'Correct') {

				guessedItems.push(kanaObj); //keep before playTestSound function
				kanaObj.disabled = true;
				$scope.panelImage = 'images/maru.png';
				$scope.panelImageShow = true;

				$timeout(function() {
					$scope.$apply('panelImageShow = false');
					$scope.backgroundImg = '';
				}, 2000);

				$scope.roundGuesses += 1;
				if ($scope.roundNumber < 3) {
					$scope.progress = $scope.roundGuesses / 15 * 100;
				} else if ($scope.roundNumber === 3) {
					$scope.progress = $scope.roundGuesses / 16 * 100;
				}
				
				$scope.progressLabel = Math.round($scope.progress);

				audio.onended = function() { //kana button sound

					correctSound.play();

					if (guessedItems.length === 15 || guessedItems.length === 30) { //Round 1, 2 finished

						$scope.roundNumber += 1;
						$scope.roundGuesses = 0;
						$scope.progress = 0;
						$scope.progressLabel = 0;

						if($scope.roundNumber === 3) {
							$scope.roundTotal = 16;
						}

						$scope.panelMessage = 'Round ' + $scope.roundNumber + '!';
						$scope.panelMessageShow = true;

						$timeout(function() {
							$scope.$apply('panelMessageShow = false');
						}, 3000);

					} 
						
					correctSound.onended = function() { 

						if (guessedItems.length === 46) { //Game Finished

							finishSound.play();

							masteryDeck = $scope.hiragana.filter(function(obj) {
								return reviewDeck.indexOf(obj) == -1;
							});

							console.log('Mastery Deck: ');
							console.log(masteryDeck);
							console.log('Review Deck: ');
							console.log(reviewDeck);
							gameOver();

						} else { //Correct but haven't finished round

							$scope.$apply(function() {
								$scope.playTestSound(guessedItems);
							});

						}
						
					}; //end correctSound.onended

				}; //end audio.onended

			//end result === 'Correct'	

			} else { //result === 'Incorrect'

				$scope.panelImage = 'images/batsu.png';
				$scope.panelImageShow = true;

				$timeout(function() {
					$scope.$apply('panelImageShow = false');
					$scope.backgroundImg = '';
				}, 2000); //Used twice: refactor as reusable function

				if(reviewDeck.indexOf(testSound) === -1) {
					reviewDeck.push(testSound);
				}
				console.log('Review Deck: ');
				console.log(reviewDeck);

				audio.onended = function() {	
					incorrectSound.play();
					incorrectSound.onended = function() {
						$scope.backgroundImg = '';
					}
				}

			} //end result === 'Incorrect'

		} //end /sound-game mode
			
	}; //End kanaButtonClicked function

	$scope.processGameMode = function(navLink){

		gameMode  = navLink;

		if(navLink === 'home') {

			$scope.panelImageShow = false;
			$scope.gameStatsShow = false;
			testSound = {};

			// // $scope.$apply(function() {
			// // 	$scope.hiragana = dataService.hiragana;
			// // });
			// console.log($scope.hiragana);
			$window.location.reload();

		} else if (navLink === 'sound-game') {

			$scope.panelImageShow = false;
			//$scope.gameStatsShow = true;
			$scope.progress = 0;
			$scope.progressLabel = 0;
			
			open(); //Open Modal that has a Start Game button

		} else if (navLink === 'word-game') {

			console.log('word game!');

			$scope.createNewGame('hiragana-sound');
    		console.log('Here is the result of creating a new game using the factory: ');
    		console.log($scope.currentGame);
    		console.log($scope.currentGame.guessed);
    		$scope.getGames();
    		console.log('Here is the result of getting the games');

		}

	}; //end processGameMode function

	function playSound(kanaObj) {
		console.log('This is inside the playSound function (before). testSound is: ');
		console.log(testSound);
		audio = new Audio(kanaObj.sound);
		audio.load();
		audio.play();
		console.log('This is inside the playSound function (after). testSound is: ');
		console.log(testSound);
	};

	function getUnguessed(guessedArray) {
		var unguessedArray = $scope.hiragana.filter(function(obj) {
			return guessedArray.indexOf(obj) == -1;
		});
		return unguessedArray;
	}

	function getRandSound (unguessedArray) {
		var soundIndex = Math.floor(Math.random() * unguessedArray.length);
		return unguessedArray[soundIndex];
	}

	function checkGuess(kanaObj) {
		console.log('The kanaObj id is ');
		console.log(kanaObj.id);
		console.log('The testSound id is ');
		console.log(testSound.id);
		if(kanaObj.id === testSound.id) {
			return 'Correct';
		} else {
			return 'Incorrect';
		}
	}

	function addClass(classToChange, newClass) {
		classToChange.push(newClass);
	}

	function removeClass(classToChange) {
		classToChange.pop();
	}

		
}); //end app.controller 'mainCtrl'
