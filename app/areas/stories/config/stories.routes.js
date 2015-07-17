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
					}],
					StoryDefaults: function(){
						return {
							coverPhoto: "http://i.imgur.com/TT7XC8m.jpg" //"https://files.slack.com/files-pri/T027XH0QK-F074TNVEK/nophoto.jpg" //"http://thecatapi.com/api/images/get?format=src"
						}
					}
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
							filterFn: communityApi.Stories.stories, 
							filterArguments: [ $stateParams.nodeId ], 
							constants: {
								limit: 24
							},
							persistFilterModel: false 
						});
					}]
				},
				reloadOnSearch: false
			})
			.state('stories.detail', {
				url: '/{storyId:int}', 
				views: {
					'mainContent': {
						templateUrl: 'stories/detail/stories.detail.html',
						controller: 'StoryDetail as vm'
					}
				},
				resolve: {
					StoryThread: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi) {
						return communityApi.Stories.thread($stateParams.storyId, { limit: 10, offset: 0 });
					}]
				}
			})
			.state('stories.new', {
				url: '/new',
				views: {
					'mainContent': {
						templateUrl: 'stories/newstory/stories.newstory.html',
						controller: 'NewStory as vm'
					}
				}
			})
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];




		angular.module('community.stories')
			.config(config);
}());