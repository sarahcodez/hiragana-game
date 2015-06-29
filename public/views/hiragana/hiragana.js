
var app = angular.module('main.hiragana', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/hiragana', {
			controller: 'mainCtrl',
			templateUrl: 'views/hiragana/hiragana.tpl.html'
		});
});

app.controller('mainCtrl', function ($scope, $modal, $log, $timeout, $location, $window, $route, $routeParams, dataService, httpService, Game) {
	
	console.log('Log in status: ' + dataService.loggedIn);

	var gameMode = 'home';
	var audio = {}; //kana buttons
	var guessedItems = [];
	var testSound = {};
	var reviewDeck = [];
	var masteryDeck = [];
	//var gameId = dataService.gameId;

	var correctSound = new Audio("audio/correct-guess-trimmed.wav");
	var incorrectSound = new Audio("audio/incorrect-guess-trimmed.wav");
	var finishSound = new Audio("audio/win-music-trimmed.wav");

	var unguessedSounds;
	var reviewMode = false;

	$scope.page = 'Hiragana';
	$scope.loggedIn = dataService.loggedIn;
	$scope.userName = dataService.userObj.username;

	//Factory Code start

	$scope.currentGame = null;

    $scope.createNewGame = function(typeString) {
        $scope.currentGame = new Game();
        $scope.currentGame.type = typeString;
    };

	//Factory Code end

	$scope.hiragana = dataService.hiragana;

	$scope.playSoundGame = false;

	$scope.panelImage = '';
	$scope.panelImageShow = false;
	$scope.transparentClass = [];
	$scope.backgroundImg = '';

	$scope.panelMessage = '';
	$scope.panelMessageShow = false;

	$scope.audioIcon = 'images/myspeakericon.png';
	$scope.highlightClass = [];

	$scope.gameStatsShow = false;

	$scope.roundNumber = 1;
	$scope.roundGuesses = 0;
	$scope.roundTotal = 15;
	$scope.progress = 0;
	$scope.progressLabel = 0;

	$scope.playTestSound = function(guessedArray) {
		var guessedSounds = guessedArray;
		unguessedSounds = getUnguessed(guessedSounds);
		testSound = getRandSound(unguessedSounds);
		$scope.applyHighlight();
		playSound(testSound);
	};

	//Functions passed to open (Game Intro) modal

	function tempSaveGame () {
		var date = new Date();
		$scope.currentGame.date = date;
		dataService.gameObj = $scope.currentGame;
		console.log('tempSaveGame function says dataService.gameObj is: ');
		console.log(dataService.gameObj);
	}

	$scope.addGame = function() {

		console.log(dataService.loggedIn);

		if(!dataService.loggedIn) {

			$location.path('/login');

		} else {

		httpService.addGame($scope.currentGame).then(function (data) {

			console.log('first add Game function says data is: ');
			console.log(data);

			dataService.gameId = data._id;
			console.log('addGame function says dataService.gameId is ' + dataService.gameId);
			$location.path('/user-stats');

		}, function (err) {

			console.log(err);

		});

		$scope.currentGame = {};


		}

	};

	$scope.startGame = function(result) {
		
		if(result === true) {

			$scope.createNewGame('hiragana-sound');
    		console.log('Here is the result of creating a new game using the factory: ');
    		console.log($scope.currentGame);

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
	    	$location.path('/');
	      	$log.info('Modal dismissed at: ' + new Date());
	    });

  	}

  	function gameOver () {

  		var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'gameOverModal.html',
	      controller: function ($scope, $modalInstance, dataService, httpService, tempSaveGame, addGame, currentGame) {

	      		$scope.currentGame = currentGame;
	      		$scope.reviewNum = currentGame.reviewDeck.length;
	      		$scope.masteryNum = currentGame.masteryDeck.length;
	      		tempSaveGame();
	      		// var gameId = gameId;

	      		$scope.ok = function () {
					$modalInstance.close(addGame);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
	      },
	      size: 'md',
	      resolve: {
	      	addGame: function() {
	      		return $scope.addGame;
	      	},
	      	tempSaveGame: function() {
	      		return tempSaveGame;
	      	},
	      	currentGame: function() {
	      		return $scope.currentGame;
	      	},
	      	gameId: function() {
	      		return dataService.gameId;
	      	}
	      }
    	});

	    modalInstance.result.then(function (addGame) {
	    	//tempSaveGame();
	    	addGame();
	    	//$location.path('/user-stats');
	    }, function () {
	    	dataService.gameObj = {}; 
			console.log(dataService.gameObj);
			$location.path('/');
	    	//$window.location.reload();
	      $log.info('Modal dismissed at: ' + new Date());
	    });

  	}
	
	$scope.applyHighlight = function() {
		addClass($scope.highlightClass, 'highlighted');
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
				$scope.currentGame.masteryDeck.push(kanaObj);
				console.log($scope.currentGame.masteryDeck);
				kanaObj.disabled = true;
				$scope.panelImage = 'images/green-maru.png';
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

						if (guessedItems.length === 3) { //Game Finished

							finishSound.play();

							for (var i = 0; i < $scope.hiragana.length; i++) {
								$scope.hiragana[i].disabled = false;			
							}

							$scope.panelImageShow = false;
							$scope.gameStatsShow = false;
							testSound = {};
							guessedItems = [];
							$scope.transparentClass = [];

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

				$scope.panelImage = 'images/red-batsu.png';
				$scope.panelImageShow = true;

				$timeout(function() {
					$scope.$apply('panelImageShow = false');
					$scope.backgroundImg = '';
				}, 2000); //Used twice: refactor as reusable function

				if($scope.currentGame.reviewDeck.indexOf(testSound) === -1) {
					//reviewDeck.push(testSound);
					$scope.currentGame.reviewDeck.push(testSound);
				}
				console.log('Review Deck: ');
				console.log($scope.currentGame.reviewDeck);

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

		$scope.panelImageShow = false;
		$scope.gameStatsShow = false;
		testSound = {};
		gameMode  = navLink;
		dataService.gameObj = {}; //may not need this later if refresh, etc.
		guessedItems = [];
		$scope.transparentClass = [];

		for (var i = 0; i < $scope.hiragana.length; i++) {
			//console.log('inside for loop');
			//console.log($scope.hiragana[i]);
			$scope.hiragana[i].disabled = false;			
		}

		console.log('is disabled?');
		console.log($scope.hiragana);
		console.log('dataService: ');
		console.log(dataService.hiragana);

		if(navLink === 'home') {

			//$window.location.reload();

		} else if (navLink === 'sound-game') {

			//$scope.panelImageShow = false;
			//$scope.gameStatsShow = true;
			$scope.progress = 0;
			$scope.progressLabel = 0;
			
			open(); //Open Modal that has a Start Game button

		} else if (navLink === 'word-game') {

			console.log('word game!');

		}

	}; //end processGameMode function

	function playSound(kanaObj) {
		console.log('TestSound is: ');
		console.log(testSound);
		audio = new Audio(kanaObj.sound);
		audio.load();
		audio.play();
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
