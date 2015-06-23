
var app = angular.module('hiragana', ['ui.bootstrap']);

app.controller('mainCtrl', function($scope, $modal, $log, $timeout, $location, dataService) {
	
	var gameMode = $location.path();
	var audio; //kana buttons
	var guessedItems;
	var testSound;
	var reviewDeck = [];
	var masteryDeck = [];

	var correctSound = new Audio("audio/correct_guess.wav");
	var incorrectSound = new Audio("audio/incorrect_guess.wav");
	var finishSound = new Audio("audio/win_music.wav");
	//var itemId;
	var unguessedSounds;
	var reviewMode = false;
	//var wrongGuesses = 0;
	//var rightGuesses = 0;

	$scope.hiragana = dataService.hiragana;

	$scope.navLinks = [{
		Title: 'home',
		LinkText: 'Sandbox'
	}, {
		Title: 'hiragana-game',
		LinkText: 'Sound Game'
	}, {
		Title: 'kotoba-game',
		LinkText: 'Word Game'
	}];

	$scope.navClass = function (page) {
		//console.log('cuz Erik said so: ' + gameMode);
		gameMode = $location.path();

		var currentRoute = $location.path().substring(1) || 'home';
		return page === currentRoute ? 'active' : '';
	};

	$scope.panelImage = '';
	$scope.panelImageShow = false;
	$scope.backgroundImg = '';

	$scope.panelMessage = '';
	$scope.panelMessageShow = false;

	$scope.audioIcon = 'images/audioicon.png';
	$scope.gameStatsShow = false;

	$scope.roundNumber = 1;
	$scope.roundGuesses = 0;
	$scope.roundTotal = 15;

	$scope.startGame = function(result) { //isChosen
		if(result === true) {
			guessedItems = [];

			$scope.roundNumber = 1;
			$scope.roundGuesses = 0;
			$scope.roundTotal = 15;
			//refactor as function
			$scope.panelMessage = 'Round 1!';
			$scope.panelMessageShow = true;
			$timeout(function() {
					$scope.$apply('panelMessageShow = false');
					$scope.playTestSound(guessedItems);
				}, 2000);

			//$scope.playTestSound(guessedItems);
		} //else redirect to home page?
	};

	// $scope.reviewGame = function(result) {
	// 	if(result === true) {
	// 		reviewMode = true;
	// 		guessedItems = masteryDeck;
	// 		console.log(masteryDeck);

	// 		$scope.panelMessage = 'Review!'
	// 	}
	// }

	$scope.highlightClass = [];

	$scope.progress = 0;
	$scope.progressLabel = 0;

	$scope.playTestSound = function(guessedArray) {
		var guessedSounds = guessedArray;
		//console.log('playTestSound function unguessedSounds: '); //this is working
		unguessedSounds = getUnguessed(guessedSounds);
		//console.log(unguessedSounds); // this is working
		testSound = getRandSound(unguessedSounds);
		//console.log('Random sound: '); //this is printing
		//console.log(testSound); //this is printing
		$scope.applyHighlight();
		playSound(testSound);
	};

	//Open a modal window to provide an intro and start button for the Sounds Game
	function open () { //refactor as a this.open function?

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'soundGameModal.html',
	      controller: function ($scope, $modalInstance, startGame) {

	      		$scope.ok = function () {
					$modalInstance.close();
				};

				$scope.start = function() {
					startGame(true);
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
	      },
	      size: 'md',
	      resolve: { //review what this does
	      	startGame: function() {
	      		return $scope.startGame;
	      	}
	      }
    	});

	    modalInstance.result.then(function () { //review what this does
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
	      resolve: { //review what this does
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

	    modalInstance.result.then(function () { //review what this does
	      console.log('Modal success!')
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
  	}
	
	$scope.applyHighlight = function() {
		//$scope.highlightClass.push('highlighted');
		addClass($scope.highlightClass, 'highlighted');
		$timeout(function() {
			$scope.highlightClass.pop(); //refactor as removeClass()
				}, 800);
	};

	$scope.testReplay = function() {
		playSound(testSound);
		//refactor as applyHighlight
		addClass($scope.highlightClass, 'highlighted');
		$timeout(function() {
					removeClass($scope.highlightClass);
				}, 800);
	};
	
	$scope.kanaButtonClicked = function(kanaObj) {

		playSound(kanaObj); //callback/delay here for correct/incorrect sound

		if(gameMode === '/hiragana-game') {

			$scope.backgroundImg = 'http://img2.wikia.nocookie.net/__cb20110209014543/japanese-ken/images/7/79/Japanese_Hiragana_A.png';
			var result = checkGuess(kanaObj);
			console.log(result);

			if (result === 'Correct') {
				kanaObj.disabled = true;
				$scope.panelImage = 'images/maru.png';
				$scope.panelImageShow = true;

				$timeout(function() {
					$scope.$apply('panelImageShow = false');
					$scope.backgroundImg = '';
				}, 2000);

				guessedItems.push(kanaObj); //keep before playTestSound function

				$scope.roundGuesses += 1;
				if ($scope.roundNumber < 3) {
					$scope.progress = $scope.roundGuesses / 15 * 100;
				} else if ($scope.roundNumber === 3) {
					$scope.progress = $scope.roundGuesses / 16 * 100;
				}
				
				$scope.progressLabel = Math.round($scope.progress);
				console.log($scope.progress);


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
									console.log($scope.panelMessage);
									$scope.panelMessageShow = true;
									$timeout(function() {
										$scope.$apply('panelMessageShow = false');
									}, 3000);

						} 
						
					correctSound.onended = function() { 

						if (guessedItems.length === 7) { //Game Finished

							finishSound.play();
							masteryDeck = $scope.hiragana.filter(function(obj) {
								return reviewDeck.indexOf(obj) == -1; //change obj.sound to obj.id
							});
							console.log('Mastery Deck: ');
							console.log(masteryDeck);
							console.log('Review Deck: ');
							console.log(reviewDeck);
							gameOver();

						} else { //correct but haven't finished round

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
				}, 2000); //can make reusable function?

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

			} //end incorrect

		} //end if hiragana mode
			
	}; //End kana click button

	$scope.processGameMode = function(navLink){

		if(navLink.Title === 'home') {

			$scope.gameStatsShow = false;

		} else if (navLink.Title === 'hiragana-game'){

			//guessedItems = []; //change to scope?
			$scope.gameStatsShow = true; //create an initialize game function
			$scope.progress = 0;
			$scope.progressLabel = 0;
			console.log('hiragana game!'); //this is working
			
			open(); //open Modal with button to start game (start sound)


			if($scope.playSoundGame === true) {
				playTestSound(guessedItems);
			} 
			// var unguessedSounds = getUnguessed(guessedItems);
			// testSound = getRandSound(unguessedSounds);
			// playSound(testSound);

			//console.log(unguessedSounds);
			//console.log(testSound);

		} else if (navLink.Title === 'kotoba-game') {
			console.log('kotoba game!');
		}
	};

	function playSound(kanaObj) {
		//$scope.sound = "audio/hira-a.mp3";
		//var audio = document.getElementsByTagName('audio');
		//console.log(kanaObj); //this is working
		audio = new Audio(kanaObj.sound);
		audio.load();
		audio.play();
		//audio.currentTime = 0;
		//$('.audio-player').play();
	};

	function getUnguessed(guessedArray) {
		console.log('Guessed array: '); //this is working
		console.log(guessedArray); //this is working
		var unguessedArray = $scope.hiragana.filter(function(obj) {
			return guessedArray.indexOf(obj) == -1; //change obj.sound to obj.id
		}); //ones that are NOT in guessed array -- indexOf -1
		console.log('Unguessed array: '); //this is working
		console.log(unguessedArray);
		return unguessedArray;
	}

	function getRandSound (unguessedArray) {
		var soundIndex = Math.floor(Math.random() * unguessedArray.length);
		return unguessedArray[soundIndex];
	}

	function checkGuess(kanaObj) {
		console.log('The kanaObj id is ' + kanaObj.id);
		console.log('The testSound id is ' + testSound.id);
		if(kanaObj.id === testSound.id) {
			return 'Correct';
		} else {
			return 'Incorrect';
		}
	}

	function addClass(classToChange, newClass) {
		classToChange.push(newClass);
		//$scope.highlightClass.push('highlighted');
	}

	function removeClass(classToChange) {
		classToChange.pop();
		//$scope.highlightClass.pop();
	}

	

		
});


app.service('dataService', function() {

	var Kana = function(name, id) {
		this.id = id;
		this.name = name; //hiragana
		this.sound = "audio/tjp/hira-" + id + '.mp3'; //sound file
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