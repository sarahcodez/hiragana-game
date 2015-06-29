var app = angular.module('main');

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

	this.gameObj = {};

	this.gameId = "";

	this.userId = "";

	this.loggedIn = false;

});