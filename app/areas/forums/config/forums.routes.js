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
			.state('forums.message', {
				url: '/message/:messageId',
				views: {
					'mainContent': {
						templateUrl: 'forums/message/forums.message.html',
						controller: 'ForumMessage as vm'
					}
				},
				resolve: {
					MessageThread: ['$stateParams', '$q', 'CommunityApiService', function($stateParams, $q, communityApi){
						var currentMessage = $stateParams.messageId;
						return $q.all([communityApi.Forums.message(currentMessage), communityApi.Forums.comments(currentMessage)])
							.then(function(result) {
								var originalMessage = [ result[0].content ];
								var comments = result[1].content;
								return originalMessage.concat(comments);
							});
					}]
				}
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