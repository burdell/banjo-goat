'use strict';

var _ = require('underscore');

var htmlUnescape = function(){
	return function(escapedHtml){
		return _.unescape(escapedHtml);
	};
}

angular.module('community.filters')
	.filter('htmlUnescape', htmlUnescape);
