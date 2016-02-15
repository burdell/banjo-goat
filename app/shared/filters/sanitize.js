
'use strict';


var marked = require('marked');
var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
	return '<a href="' + href + '" target="_self">' +  text + '</a>';
}

var emojify = require('filters/commemojify.js');
// additional custom emoji keywords ex: ":ubnt:". needs to lead with ','
emojify.setEmoji(",ca,ch,cn,co,dk,fi,ie,il,in,ubnt,ubnt-banana,poo,poop");
emojify.setConfig({
	mode: 'data-uri'
});

var _ = require('underscore');


var userNamePattern = /\B@[a-z0-9_\-]+/gi;
var sanitize = function($sce, routingService){
	return function(body, format){
		var messageFormat = (!format || format === 'html') ? 'html' : 'markdown';
		
		var mentionedUsers = body.match(userNamePattern);
		if (mentionedUsers) {
			_.each(mentionedUsers, function(user){
				var justTheName = user.substr(1);
				body = body.replace(justTheName, function(userName){
					var profileUrl = routingService.generateUrl('userprofile', {  userId: userName });

					if (messageFormat === 'html') {
						return '<a href="' + profileUrl + '">' + userName + '</a>';
					} 


					return '[' + userName + '](' + profileUrl + ')';
				});
			});
		}	
		
		if (messageFormat === 'html') {
			return $sce.trustAsHtml(body);
		} 

		body = marked(body, { sanitize: true, breaks: true, renderer: renderer });
		return emojify.replace(body);
	};
};
sanitize.$inject = ['$sce', require('services/routing.js')];

angular.module('community.filters')
	.filter('sanitize', sanitize);

