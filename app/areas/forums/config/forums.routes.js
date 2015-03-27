(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
			.state('forums', {
				abstract: true,
				url: '/uf/u/nodes/:nodeId',
				templateUrl: 'forums/forums.html',
				controller: 'Forum as vm'
			})
			.state('forums.list', {
				url: '/list?offset&sort', 
				views: {
					'mainContent': {
						templateUrl: 'forums/list/forums.list.html',
						controller: 'ForumList as vm'
					},
					'sidebar': {
						templateUrl: 'forums/list/forums.list.sidebar.html',
						controller: 'ForumListSidebar as vm'
					}
				},
				resolve: {
					ForumListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
						var apiArgs = [ $stateParams.nodeId ];
						var initialModel = { 
							sort: $stateParams.sort, 
							offset: $stateParams.offset
						};

						return filterService.getNewFilter().set(communityApi.Forums.messages, apiArgs, initialModel);
					}]
				}
			})
			.state('forums.thread', {
				url: '/t',
				templateUrl: 'forums/forums.thread.html',
				controller: 'ForumThread as vm'
			})
			.state('forums.newtopic', {
				url: '/n',
				templateUrl: 'forums/forums.newtopic.html',
				controller: 'NewForumTopic as vm'
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

		angular.module('community.forums')
			.config(config);
}());