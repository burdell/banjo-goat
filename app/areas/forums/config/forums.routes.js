
'use strict';

require('providers/routes.js');

require('services/api.js');
require('services/filter.js');


var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
	$locationProvider.html5Mode(true);

	var forumRoutes = routesProvider.routes.forums;
	$stateProvider
		.state('forums', {
			abstract: true,
			url: forumRoutes.forums,
			templateUrl: 'forums/forums.html',
			controller: 'Forum as vm'
		})
		.state('forums.list', {
			url: forumRoutes.list + '?offset&sort', 
			views: {
				'mainContent': {
					templateUrl: 'forums/list/forums.list.html',
					controller: 'ForumList as vm'
				}
			},
			resolve: {
				ForumListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
					return filterService.getNewFilter({ 
						filterFn: communityApi.Forums.messages, 
						filterArguments: [ $stateParams.nodeId ], 
						constants: {
							per_page: 30
						} 
					});
				}]
			},
			reloadOnSearch: false
		})
		.state('forums.message', {
			url: forumRoutes.message,
			views: {
				'mainContent': {
					templateUrl: 'forums/message/forums.message.html',
					controller: 'ForumMessage as vm'
				}
			},
			resolve: {
				MessageThreadFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
					return filterService.getNewFilter({ 
						filterFn: communityApi.Forums.comments, 
						filterArguments: [ $stateParams.messageId ],
						filterContext: communityApi.Forums,
						constants: {
							limit: 20
						},
						autoInitModel: false,
						persistFilterModel: false
					});
				}]
			},
			reloadOnSearch: false
		})
		.state('forums.newtopic', {
			url: forumRoutes.newtopic,
			views: {
				'mainContent': {
					templateUrl: 'forums/newtopic/forums.newtopic.html',
					controller: 'NewForumTopic as vm'
				}
			}
		});
	};
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
	
	angular.module('community.forums')
		.config(config);
