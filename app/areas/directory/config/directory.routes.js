'use strict';

require('services/api.js')
require('services/filter.js');
require('services/routing.js');
require('services/nodestructure.js');

require('providers/routes.js');


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
					AnnouncementsData: ['$stateParams', 'CommunityApiService', 'CommunityRoutingService', function($stateParams, communityApi, routingService){
						return communityApi.Announcements.announcements(routingService.generateDiscussionUrl($stateParams.nodeId, 'announcements'), { per_page: 5 });
					}],
					StoryData: ['$stateParams', 'CommunityApiService', 'CommunityRoutingService', function($stateParams, communityApi, routingService){
						return communityApi.Stories.stories(routingService.generateDiscussionUrl($stateParams.nodeId, 'stories'), { per_page: 4 });
					}],
					DiscussionsFeedFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Feed.allContent,
							constants: { nodeUrlCode: $stateParams.nodeId, size: 6 },
							autoInitModel: false,
							persistFilterModel: false
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
							constants: { size: 10 },
							realtime: true,
							autoInitModel: false,
							persistFilterModel: false
						});
					}],
					AnnouncementsData: ['CommunityApiService', function(communityApi){
						return communityApi.Announcements.all({ per_page: 5, sort: 'postDate' });
					}],
					StoryFilter: ['CommunityApiService', 'CommunityFilterService', function(communityApi, filterService) {
						return filterService.getNewFilter({ 
							filterFn: communityApi.Stories.search,
							constants: { per_page: 4 },
							autoInitModel: false,
							persistFilterModel: false
						});
					}]
				}
			})
			.state('userprofile', {
				abstract: true,
				url: routes.userprofile.userprofile,
				templateUrl: 'directory/user/profilecontainer.html',
				controller: 'UserProfileContainer as vm',
				resolve: {
					UserData: ['$stateParams', 'CommunityApiService', 'CurrentUserService', function($stateParams, communityApi, userServiceWrapper){
						var userId = $stateParams.userId;

						//linking to user id
						if (Number(userId)) {
							return userServiceWrapper.get().then(function(userService){
								var currentUser = userService.user;
								if (currentUser.id === Number($stateParams.userId)) {
									return {
										user: userService.user
									}
								} else {
									return communityApi.Users.userData($stateParams.userId).then(function(result){
										return {
											user: result
										}
									});
								}
							});
						}
						//linking to username 
						else {
							return communityApi.Users.search(userId, true).then(function(result){	
								if (result.content.length === 1) {
									return {
										user: result.content[0]
									}
								} 
							});
						}
					}]
				}			
			})
			.state('userprofile.userprofile', {
				url: '',
				controller: 'UserProfile as vm',
				templateUrl: 'directory/user/userprofile.html',
				resolve: {
					StoryDataFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', 'CurrentUserService', function($stateParams, communityApi, filterService, userServiceWrapper){
							return filterService.getNewFilter({ 
								filterFn: communityApi.Stories.search,
								constants: { per_page: 2, insertUserId: $stateParams.userId },
								persistFilterModel: false
							});
					}],
					ActivityDataFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', 'CurrentUserService', function($stateParams, communityApi, filterService, userServiceWrapper){
							return filterService.getNewFilter({ 
								filterFn: communityApi.Feed.allContent,
								constants: { size: 4, topics: false },
								persistFilterModel: false
							});
					}],
					GamificationInfo: ['CommunityApiService', function(communityApi){
						return communityApi.Gamification.info();
					}]
				}			
			})
			.state('userprofile.usersettings', {
				url: routes.userprofile.usersettings,
				controller: 'UserSettings as vm',
				templateUrl: 'directory/user/usersettings.html',
				resolve: {
					UserSettings: ['CommunityApiService', function(communityApi){
						return communityApi.Users.settings();
					}]
				}		
			})
			.state('notifications', {
				url: routes.notifications,
				templateUrl: 'directory/notifications/notifications.html',
				controller: 'Notifications as vm',
				resolve: {
					NotificationsFilter: ['CommunityApiService', 'CommunityFilterService', function(communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Feed.notifications,
							constants: { size: 20 },
							autoInitModel: false,
							persistFilterModel: false
						});
					}]
				}
			})
			.state('searchpage', {
				url: routes.searchpage + '?q',
				templateUrl: 'directory/searchpage/searchpage.html',
				controller: 'SearchPage as vm',
				reloadOnSearch: false,
				resolve: {
					SearchFilter: ['CommunityApiService', 'CommunityFilterService', function(communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Core.search,
							filterArguments: ['messages'],
							constants: { per_page: 20 },
							persistFilterModel: false
						});
					}]
				}
			})
			.state('inbox', {
				url: routes.inbox.inbox,
				templateUrl: 'directory/inbox/inbox.html',
				controller: 'InboxController as vm',
				resolve: {
					InboxMessageFilter: ['CommunityApiService', 'CommunityFilterService', function(communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Feed.inbox,
							constants: { per_page: 20 },
							autoInitModel: false,
							persistFilterModel: false
						});
					}]
				}
			})
			.state('inbox.newtopic', {
				url: routes.inbox.newtopic,
				views: {
					'mainContent': {
						templateUrl: 'directory/inbox/newmessage/inbox.newmessage.html',
						controller: 'NewMessageController as vm'
					}
				}
			})
			.state('inbox.detail', {
				url: routes.inbox.detail,
				templateUrl: 'directory/inbox/detail/inbox.detail.html',
				views: {
					'mainContent': {
						templateUrl: 'directory/inbox/detail/inbox.detail.html',
						controller: 'InboxMessageController as vm'
					}
				},
				resolve: {
					InboxThreadFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Feed.inboxMessage,
							constants: { per_page: 20 },
							filterArguments: [ $stateParams.messageId ],
							autoInitModel: false,
							persistFilterModel: false
						});
					}]
				}
			})
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
		
		angular.module('community.directory')
			.config(config);
