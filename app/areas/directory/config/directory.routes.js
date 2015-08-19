(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
		$locationProvider.html5Mode(true);

		var routes = routesProvider.routes;
		$stateProvider
			.state('directory', {
				url: routes.directory,
				templateUrl: 'directory/directory/directory.html',
				controller: 'Directory as vm',
				resolve: {
					NodeService: ['CommunityNodeService', function(nodeServiceWrapper) {
						return nodeServiceWrapper.get('community');
					}]
				}
			})
			.state('hub', {
				url: routes.hub,
				templateUrl: 'directory/hub/hub.html',
				controller: 'Hub as vm',
				resolve: {
					HubData: ['$stateParams', '$q', 'CommunityApiService', 'CommunityRoutingService', function($stateParams, $q, communityApi, routingService){
						var storiesData = communityApi.Stories.stories(routingService.generateDiscussionUrl($stateParams.nodeId, 'stories'), { limit: 4 });
						var announcementsData = communityApi.Forums.messages(routingService.generateDiscussionUrl($stateParams.nodeId, 'announcements'), { limit: 4 });

						return $q.all([ storiesData, announcementsData ]).then(function(result){
							return {
								stories: result[0].collection,
								announcements: result[1].collection
							}
						});
					}]
				}
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
		
		angular.module('community.directory')
			.config(config);
}());