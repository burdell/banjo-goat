(function(){
	'use strict';
	
	var baseTag = document.createElement('base');
	baseTag.setAttribute('href', '/');
	document.head.appendChild(baseTag);
	
	angular.module('communityApp', [
		'ui.router', 
		'community.shared', 
		'community.forums', 
		'community.templates'
	]);

	angular.element(document).ready(function(){
		angular.bootstrap(document, ['communityApp']);
	});

}());
