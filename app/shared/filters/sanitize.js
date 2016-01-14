
'use strict';

var marked = require('marked');
var emojify = require('filters/commemojify.js');

emojify.setEmoji(",ca,ch,cn,co,dk,fi,ie,il,in,ubnt,ubnt-banana");
emojify.setConfig({
	mode: 'data-uri'
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

