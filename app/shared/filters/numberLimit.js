
'use strict';

// number can't go higher than this value
var maxLimit = function(){
	return function(input, max){
		if (max < 0) return limit;
		return (input > max) ? max : input;
	};
};

angular.module('community.filters')
	.filter('maxLimit', maxLimit);

