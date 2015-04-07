(function(_){
	'use strict';
	
	var wordCut = function(){
		return function(wordString){
			var wordLimit = 100;

			var wordList = wordString.split(' ');
			
			if (wordList.length >= wordLimit) {
				wordList = _.first(wordList, wordLimit);
				wordList.push('...');
			}

			return wordList.join(' ');
		};
	};
	
	angular.module('community.filters')
		.filter('wordCut', wordCut);

}(window._));