(function(){
	'use strict';

	angular.module('communityApp', ['ui.router', 'community-shared', 'community-discussions', 'community-templates']);

	angular.element(document).ready(function() {
		angular.bootstrap(document, ['communityApp']);
	});
}());
