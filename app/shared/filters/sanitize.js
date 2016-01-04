
'use strict';

var marked = require('marked');

var sanitize = function($sce){
	return function(body, format){
		if (!format || format === 'html') {
			return $sce.trustAsHtml(body);
		} 

		return marked(body, { sanitize: true, breaks: true });
	};
};
sanitize.$inject = ['$sce'];

angular.module('community.filters')
	.filter('sanitize', sanitize);

