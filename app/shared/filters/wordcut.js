
'use strict';

var _ =  require('underscore');

var wordCut = function(){
	return function(wordString, limit){
		if (!wordString) {
			return '';
		}

		var wordLimit = limit || 100;

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

