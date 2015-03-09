(function(){
	'use strict';

	angular.module('communityApp', ['community-shared', 'community-discussions']);

	angular.element(document).ready(function() {
		angular.bootstrap(document, ['communityApp']);
	});
}());
