
var angular = require('angular');

var unformatText = function(){
	return function(formattedText){
		var element = angular.element('<div>' + formattedText + '</div>');
		return element.text() || '';
	};
}

angular.module('community.filters')
	.filter('unformatText', unformatText);

