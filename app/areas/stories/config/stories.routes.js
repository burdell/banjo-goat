(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('stories', {		
				abstract: true,
				url: '/stories/:nodeId',
				templateUrl: 'stories/stories.html',
				controller: 'Stories as vm',
				resolve: {
					CommunityNodeStructure: ['$stateParams', 'CommunityNodeService', function($stateParams, nodeService){
						return nodeService.setNodeStructure($stateParams.nodeId);
					}]
				},
			})
			.state('stories.list', {
				url: '/list?offset&sort', 
				views: {
					'mainContent': {
						templateUrl: 'stories/list/stories.list.html',
						controller: 'StoriesList as vm'
					}
				},
				resolve: {
					StoryListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Forums.messages, 
							filterArguments: [ $stateParams.nodeId ], 
							constants: {
								limit: 30
							} 
						});
					}]
				},
				reloadOnSearch: false
			})
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];




		angular.module('community.stories')
			.config(config);
}());