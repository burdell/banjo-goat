(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('discussions', {
			url: '/index.php',
			templateUrl: 'discussions.html',
			controller: 'Discussions as vm',
			resolve: {
				NodeMessages: ['CommunityApiService', function(communityApi){
					return communityApi.Node(1).messages();
				}],
				NodeStats: ['CommunityApiService', function(communityApi){
					return communityApi.Node(1).stats();
				}],
				NodeTags: ['CommunityApiService', function(communityApi){
					return communityApi.Node(1).tags();
				}]
			}
		});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

		angular.module('community-discussions')
			.config(config);
}());