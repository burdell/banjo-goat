(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
			.state('forums', {
				abstract: true,
				url: '/uf/u/nodes/:nodeId',
				templateUrl: 'forums/forums.html',
				controller: 'Forum as vm',
				resolve: {
					CommunityNodeStructure: ['$stateParams', 'CommunityNodeService', function($stateParams, nodeService){
						return nodeService.setNodeStructure($stateParams.nodeId);
					}],
					ForumListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Forums.messages, 
							filterArguments: [ $stateParams.nodeId ], 
							autoInitModel: true 
						});
					}]
				}
			})
			.state('forums.list', {
				url: '/list?offset&sort', 
				views: {
					'mainContent': {
						templateUrl: 'forums/list/forums.list.html',
						controller: 'ForumList as vm'
					}
				},
				reloadOnSearch: false
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