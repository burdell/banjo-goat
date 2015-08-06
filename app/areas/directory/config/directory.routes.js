(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
		$locationProvider.html5Mode(true);

		var directoryRoutes = routesProvider.routes.directory;
		$stateProvider
			.state('directory', {
				url: directoryRoutes.directory,
				templateUrl: 'directory/directory.html',
				controller: 'Directory as vm',
				resolve: {
					NodeService: ['CommunityNodeService', function(nodeServiceWrapper) {
						return nodeServiceWrapper.get('community');
					}]
				}
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
		
		angular.module('community.directory')
			.config(config);
}());