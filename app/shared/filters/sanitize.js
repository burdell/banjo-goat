
'use strict';

var marked = require('marked');
var emojify = require('filters/commemojify.js');

// additional custom emoji keywords ex: ":ubnt:". needs to lead with ','
emojify.setEmoji(",ca,ch,cn,co,dk,fi,ie,il,in,ubnt,ubnt-banana,poo,poop");
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

