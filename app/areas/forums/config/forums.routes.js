(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
			.state('forums', {
				abstract: true,
				url: '/uf',
				templateUrl: 'forums/forums.html',
				controller: 'Forum as vm',
				resolve: {
					NodeMessages: ['CommunityApiService', function(communityApi){
						return {}; //communityApi.Node(1).messages();
					}],
					NodeStats: ['CommunityApiService', function(communityApi){
						return {}; //communityApi.Node(1).stats();
					}],
					NodeTags: ['CommunityApiService', function(communityApi){
						return {}; //communityApi.Node(1).tags();
					}]
				}
			})
			.state('forums.list', {
				url: '/u',
				templateUrl: 'forums/forums.list.html',
				controller: 'ForumList as vm'
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