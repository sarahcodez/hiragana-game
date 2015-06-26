
var app = angular.module('main.hiragana', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider
		// .when('/hiragana', {
		// 	redirectTo: '/hiragana/home'
		// })
		// .when('/hiragana/:secondaryNav', {
		// 	controller: 'mainCtrl',
		// 	templateUrl: 'views/hiragana/hiragana.tpl.html'
		// });
		.when('/home', {
			controller: 'mainCtrl',
			templateUrl: 'views/hiragana/hiragana.tpl.html'
		})
		.when('/sound-game', {
			controller: 'mainCtrl',
			templateUrl: 'views/hiragana/hiragana.tpl.html'
		})
		.when('/word-game', {
			controller: 'mainCtrl',
			templateUrl: 'views/hiragana/hiragana.tpl.html'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

app.controller('mainCtrl', function($scope, $modal, $log, $timeout, $location, $route, $routeParams, dataService, Game) {
	//inject routeParams as dependency
	var gameMode = 'home';
	var audio; //kana buttons
	var guessedItems;
	var testSound;
	var reviewDeck = [];
	var masteryDeck = [];

	var correctSound = new Audio("audio/correct_guess.wav");
	var incorrectSound = new Audio("audio/incorrect_guess.wav");
	var finishSound = new Audio("audio/win_music.wav");

	var unguessedSounds;
	var reviewMode = false;

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

	$scope.navLinks = [{
		Title: 'home',
		LinkText: 'Home'
	}, {
		Title: 'sound-game',
		LinkText: 'Sound Game'
	}, {
		Title: 'word-game',
		LinkText: 'Word Game'
	}];

	$scope.navClass = function (page) {
		//gameMode = $location.path();
		//console.log('NavClass says the gameMode is ' + gameMode);
		var currentRoute = $location.path().substring(1) || 'home';
		return page === currentRoute ? 'active' : '';
	};

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
		console.log('This is in the StartGame function before result is true: ' + result);
		if(result === true) {
			console.log('Start function called!');
			console.log('Result is ' + result);
			console.log('In the startGame function, the location path is ' + $location.path() + ' and the Game Mode is ' + gameMode);
			$scope.gameStatsShow = true; //this is not working
			console.log('John Wayne = ' + $scope.gameStatsShow);
			guessedItems = [];
			$scope.roundNumber = 1; //this is working because already initialized
			$scope.roundGuesses = 0; //this is working because already initialized
			$scope.roundTotal = 15; //this is working because already initialized
			$scope.panelMessage = 'Round 1!'; //this is not working
			$scope.panelMessageShow = true; //this is not working
			$timeout(function() {
					console.log('This is inside the startGame timeout function (before). testSound is: ');
					console.log(testSound);
					$scope.$apply('panelMessageShow = false');

					$scope.playTestSound(guessedItems); //this is working but it is not passing the testSound
					
					console.log('This is inside the startGame timeout function (right after). testSound is: ');
					console.log(testSound);

					console.log('The guessed Items are ' + guessedItems);
					console.log(guessedItems);
					console.log('the testSound is');
					console.log(testSound);
				}, 2000);
		}
	};

	$scope.playTestSound = function(guessedArray) {
		var guessedSounds = guessedArray;
		unguessedSounds = getUnguessed(guessedSounds);
		console.log('This is inside the playTestSound function (before). testSound is: ');
		console.log(testSound);
		testSound = getRandSound(unguessedSounds);
		console.log('This is inside the playTestSound function (after). testSound is: ');
		console.log(testSound);
		$scope.applyHighlight(); //this is not working
		playSound(testSound);
	};

	//Open a modal window to provide an intro and start button for the Sounds Game

	// function open () { //rename as soundGameIntro //modified

	//     var modalInstance = $modal.open({
	//       animation: true,
	//       templateUrl: 'soundGameModal.html',
	//       controller: function ($scope, $modalInstance, playSoundGame) {

	//       		$scope.playSoundGame = playSoundGame;

	//       		$scope.ok = function () {
	//       			$scope.playSoundGame = true;
	// 				$modalInstance.close($scope.playSoundGame);
	// 			};

	// 			// $scope.start = function() {
	// 			// 	return true;
	// 			// 	//startGame(true);
	// 			// };

	// 			$scope.cancel = function () {
	// 				$modalInstance.dismiss('cancel');
	// 			};
	//       },
	//       size: 'md',
	//       resolve: { //passes information from main scope to scope for modal
	//       	playSoundGame: function() {
	//       		return $scope.playSoundGame;
	//       	}
	//       }
 //    	});

	//     modalInstance.result.then(function (result) {
	//     	$scope.playSoundGame = result;
	//     	startGame();
	//       	console.log('Modal success!')
	//       	console.log($scope.playSoundGame);
	//     }, function () {
	//       $log.info('Modal dismissed at: ' + new Date());
	//     });

 //  	}

	//original
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

		console.log('Clint Eastwood at the top of the kanaButtonClicked function says the testSound is: ');
		console.log(testSound);
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

		// $location.path('/' + navLink.Title);
		gameMode  = navLink;
		console.log('processGameMode changed the location path to: ' + $location.path() + 'and the gameMode to ' + gameMode);
		//$route.reload();

		if(navLink === 'home') {

			// console.log('gameMode is ' + gameMode);
			// console.log('locationpath is' + $location.path());
			// console.log('navLink title is ' + navLink.Title);
			$scope.panelImageShow = false;
			$scope.gameStatsShow = false;

		} else if (navLink === 'sound-game') {

			// console.log('gameMode is ' + gameMode);
			// console.log('locationpath is' + $location.path());
			// console.log('navLink title is ' + navLink.Title);
			$scope.panelImageShow = false;
			//$scope.gameStatsShow = true;
			$scope.progress = 0;
			$scope.progressLabel = 0;
			
			open(); //Open Modal that has a Start Game button

			// if($scope.playSoundGame === true) {
			// 	playTestSound(guessedItems);
			// }

		} else if (navLink === 'word-game') {

			// console.log('gameMode is ' + gameMode);
			// console.log('locationpath is' + $location.path());
			// console.log('navLink title is ' + navLink.Title);
			console.log('word game!');
			//$scope.startGame(true);
			$scope.createNewGame('hiragana-sound');
    		console.log('Here is the result of creating a new game using the factory: ');
    		console.log($scope.currentGame);
    		console.log($scope.currentGame.guessed);

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


app.service('dataService', function() {

	var Kana = function(name, id) {
		this.id = id;
		this.name = name; //hiragana
		this.sound = "audio/tjp/hira-" + id + '.mp3'; //sound file
		this.image = "images/hiragana/hiragana-" + id + '.png';
		this.animated = "images/stroke-order/Hiragana_" + this.name + "_stroke_order_animation.gif";
		this.disabled = false;
	};

	var hiraA = new Kana('あ', 'a');
	var hiraI = new Kana('い', 'i');
	var hiraU = new Kana('う', 'u');
	var hiraE = new Kana('え', 'e');
	var hiraO = new Kana('お', 'o');
	var hiraKa = new Kana('か', 'ka');
	var hiraKi = new Kana('き', 'ki');
	var hiraKu = new Kana('く', 'ku');
	var hiraKe = new Kana('け', 'ke');
	var hiraKo = new Kana('こ', 'ko');
	var hiraSa = new Kana('さ', 'sa');
	var hiraShi = new Kana('し', 'shi');
	var hiraSu = new Kana('す', 'su');
	var hiraSe = new Kana('せ', 'se');
	var hiraSo = new Kana('そ', 'so');
	var hiraTa = new Kana('た', 'ta');
	var hiraChi = new Kana('ち', 'chi');
	var hiraTsu = new Kana('つ', 'tsu');
	var hiraTe = new Kana('て', 'te');
	var hiraTo = new Kana('と', 'to');
	var hiraNa = new Kana('な', 'na');
	var hiraNi = new Kana('に', 'ni');
	var hiraNu = new Kana('ぬ', 'nu');
	var hiraNe = new Kana('ね', 'ne');
	var hiraNo = new Kana('の', 'no');
	var hiraHa = new Kana('は', 'ha');
	var hiraHi = new Kana('ひ', 'hi');
	var hiraFu = new Kana('ふ', 'fu');
	var hiraHe = new Kana('へ', 'he');
	var hiraHo = new Kana('ほ', 'ho');
	var hiraMa = new Kana('ま', 'ma');
	var hiraMi = new Kana('み', 'mi');
	var hiraMu = new Kana('む', 'mu');
	var hiraMe = new Kana('め', 'me');
	var hiraMo = new Kana('も', 'mo');
	var hiraYa = new Kana('や', 'ya');
	var hiraYu = new Kana('ゆ', 'yu');
	var hiraYo = new Kana('よ', 'yo');
	var hiraRa = new Kana('ら', 'ra');
	var hiraRi = new Kana('り', 'ri');
	var hiraRu = new Kana('る', 'ru');
	var hiraRe = new Kana('れ', 're');
	var hiraRo = new Kana('ろ', 'ro');
	var hiraWa = new Kana('わ', 'wa');
	var hiraWo = new Kana('を', 'wo');
	var hiraN = new Kana('ん', 'n');

	this.hiragana = [hiraA, hiraI, hiraU, hiraE, hiraO, hiraKa, hiraKi, hiraKu, hiraKe, hiraKo, hiraSa, hiraShi, hiraSu, hiraSe, hiraSo, hiraTa, hiraChi, hiraTsu, hiraTe, hiraTo, hiraNa, hiraNi, hiraNu, hiraNe, hiraNo, hiraHa, hiraHi, hiraFu, hiraHe, hiraHo, hiraMa, hiraMi, hiraMu, hiraMe, hiraMo, hiraYa, hiraYu, hiraYo, hiraRa, hiraRi, hiraRu, hiraRe, hiraRo, hiraWa, hiraWo, hiraN];

});