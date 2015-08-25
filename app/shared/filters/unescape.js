(function(_){
	'use strict';
	
	var htmlUnescape = function(){
		return function(escapedHtml){
			return _.unescape(escapedHtml);
		};
	}

	angular.module('community.filters')
		.filter('htmlUnescape', htmlUnescape);

}(window._));