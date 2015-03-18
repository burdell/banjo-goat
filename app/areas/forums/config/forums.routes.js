(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
			.state('forums', {
				abstract: true,
				url: '/uf/u/nodes/:nodeId/forums',
				templateUrl: 'forums/forums.html',
				controller: 'Forum as vm'
			})
			.state('forums.list', {
				url: '/list',
				templateUrl: 'forums/forums.list.html',
				controller: 'ForumList as vm',
				resolve: {
					ForumMessages: ['$stateParams', 'CommunityApiService', function(params, communityApi){
						return communityApi.Forums.messages(params.nodeId);
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