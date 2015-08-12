(function(){
	'use strict';
	
	var baseTag = document.createElement('base');
	baseTag.setAttribute('href', '/');
	document.head.appendChild(baseTag);
	
	angular.module('communityApp', [
		'ui.router',
        'ui.select',
        'ngSanitize',
        'ng-sortable',
        'community.providers',
		'community.services',
        'community.directives', 
        'community.filters',  
		'community.templates',
        'community.{{GULP_BUILD_areaName}}', 
	]).run(['$rootScope', '$state', '$window', 'CurrentUserService', function($rootScope, $state, $window, currentUser){
        $rootScope.$on('$stateChangeSuccess', function(){
            $window.scrollTo(0,0);
        });
    }]);

	angular.element(document).ready(function(){
		angular.bootstrap(document, ['communityApp']);
	});

}());