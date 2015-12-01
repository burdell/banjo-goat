
'use strict';

require('providers/routes.js');

require('services/api.js');
require('services/filter.js');


var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
	$locationProvider.html5Mode(true);

	var forumRoutes = routesProvider.routes.forums;
	var standardRoutes = routesProvider.routes.standardRoutes;
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
							per_page: 30,
							sortDir: 'DESC'
						}
					});
				}]
			},
			reloadOnSearch: false
		})
		.state('forums.edit', standardRoutes.newTopic({
			url: forumRoutes.edit,
			resolve: {
				MessageDetail: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
					if ($stateParams.messageType === 'comment') {
						return communityApi.Messages.message(Number($stateParams.id));
					} else {
						return communityApi.Forums.message(Number($stateParams.id));
					}
				}]
			}
		}, true))
		.state('forums.detail', {
			url: forumRoutes.detail,
			views: {
				'mainContent': {
					templateUrl: 'forums/message/forums.message.html',
					controller: 'ForumMessage as vm'
				}
			},
			resolve: {
				MessageThreadFilter: ['$stateParams', '$location', 'CommunityApiService', 'CommunityFilterService', function($stateParams, $location, communityApi, filterService){
					return filterService.getNewFilter({ 
						filterFn: communityApi.Forums.comments, 
						filterArguments: [ $stateParams.messageId ],
						filterContext: communityApi.Forums,
						constants: {
							per_page: 10,
							sortDir: 'ASC',
							sortField: 'postDate'
						},
						autoInitModel: false,
						persistFilterModel: false,
						saveMeta: true,
						targetCommentHash: true
					});
				}]
			}
		})
		.state('forums.newtopic', standardRoutes.newTopic());
	};
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
	
	angular.module('community.forums')
		.config(config);
