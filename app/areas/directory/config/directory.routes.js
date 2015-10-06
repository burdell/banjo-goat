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

						var nodeHasStories = function() {
							return $stateParams.nodeId.indexOf('airCRM') < 0;
						};

						var callList = [communityApi.Forums.messages(routingService.generateDiscussionUrl($stateParams.nodeId, 'announcements'), { per_page: 4 })];
						if (nodeHasStories()) {
							callList.push(communityApi.Stories.stories(routingService.generateDiscussionUrl($stateParams.nodeId, 'stories'), { per_page: 4 }))
						}
						
						return $q.all(callList).then(function(result){
							return {
								stories: result[1] ? result[1].content : [],
								announcements: result[0].content
							}
						});
					}]
				}
			})
			.state('feed', {
				url: routes.feed,
				templateUrl: 'directory/feed/feed.html',
				controller: 'Feed as vm',
				resolve: {
					FeedFilter: ['CommunityApiService', 'CommunityFilterService', function(communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Feed.allContent,
							constants: { per_page: 20, sortDir: 'ASC' },
							realtime: true
						});
					}],
					AnnouncementsData: ['CommunityApiService', function(communityApi){
						return communityApi.Announcements.all({ per_page: 5, sort: 'postDate' });
					}],
					StoryData: ['CommunityApiService', function(communityApi){
						return communityApi.Stories.all({ per_page: 4, sortField: 'postDate' });
					}]
				}
			})
			.state('userprofile', {
				url: routes.userprofile,
				templateUrl: 'directory/user/userprofile.html',
				controller: 'UserProfile as vm',
				resolve: {
					UserData: ['$stateParams', 'CommunityApiService', 'CurrentUserService', function($stateParams, communityApi, userServiceWrapper){
						if (!$stateParams.userId) {
							return userServiceWrapper.get().then(function(userService){
								return {
									selfUser: true,
									user: userService.user
								}
								
							});
						} else {
							return communityApi.User.userData($stateParams.userId).then(function(result){
								return {
									selfUser: false,
									user: result
								}
							});
						}
					}],
					StoryDataFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', 'CurrentUserService', function($stateParams, communityApi, filterService, userServiceWrapper){
						if (!$stateParams.userId) {
							return userServiceWrapper.get().then(function(userService){
								return filterService.getNewFilter({ 
									filterFn: communityApi.Stories.search,
									constants: { per_page: 3, sortDir: 'ASC', author_id: userService.user.id },
									persistFilterModel: false
								});
							});
						} else {
							return filterService.getNewFilter({ 
								filterFn: communityApi.Stories.all,
								constants: { per_page: 3, sortDir: 'ASC', author_id: $stateParams.userId },
								persistFilterModel: false
							});
						}
					}],
					ActivityDataFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', 'CurrentUserService', function($stateParams, communityApi, filterService, userServiceWrapper){
						if (!$stateParams.userId) {
							return userServiceWrapper.get().then(function(userService){
								return filterService.getNewFilter({ 
									filterFn: communityApi.Feed.allContent,
									constants: { size: 3, sortDir: 'ASC', authorId: userService.user.id },
									persistFilterModel: false
								});
							});
						} else {
							return filterService.getNewFilter({ 
								filterFn: communityApi.Feed.allContent,
								constants: { size: 3, sortDir: 'ASC', authorId: $stateParams.userId },
								persistFilterModel: false
							});
						}
					}],
					GamificationInfo: ['CommunityApiService', function(communityApi){
						return communityApi.Gamification.info();
					}]
				}
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
		
		angular.module('community.directory')
			.config(config);
}());