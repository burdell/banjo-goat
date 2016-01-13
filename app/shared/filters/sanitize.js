
'use strict';

var marked = require('marked');
var emojify = require('emojify.js');
emojify.setConfig({
	mode: 'sprite'
});

var sanitize = function($sce){
	return function(body, format){
		if (!format || format === 'html') {
			return $sce.trustAsHtml(body);
		} 

		body = marked(body, { sanitize: true, breaks: true });
		return emojify.replace(body);
	};
};
sanitize.$inject = ['$sce'];

angular.module('community.filters')
	.filter('sanitize', sanitize);

