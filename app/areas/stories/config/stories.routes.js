(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		var storyDefaults = function(){
			return {
				coverPhoto: "http://i.imgur.com/TT7XC8m.jpg"
			}
		};

		$stateProvider
			.state('storiesLanding', {
				url: '/stories/',
				templateUrl: 'stories/landing/stories.landing.html',
				controller: 'StoriesList as vm',
				resolve: {
					CommunityNodeStructure: ['$stateParams', 'CommunityBreadcrumbService', 'CommunityNodeService', function($stateParams, breadcrumbService, nodeService){
						var nodeStructure = nodeService.setNodeStructure('root');
						breadcrumbService.setCurrentBreadcrumb('Stories');
						return nodeStructure;
					}],
					StoryDefaults: storyDefaults,
					StoryListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
						return filterService.getNewFilter({ 
							filterFn: communityApi.Stories.stories, 
							filterArguments: [ 'airMAX_Stories' ], 
							constants: {
								limit: 30
							},
							persistFilterModel: false 
						});
					}]
				},
				reloadOnSearch: false
			})
			.state('stories', {		
				abstract: true,
				url: '/stories/:nodeId',
				templateUrl: 'stories/stories.html',
				controller: 'Stories as vm',
				resolve: {
					CommunityNodeStructure: ['$stateParams', 'CommunityNodeService', function($stateParams, nodeService){
						return nodeService.setNodeStructure($stateParams.nodeId);
					}],
					StoryDefaults: storyDefaults
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
								limit: 30
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
					}],
					StoryListConfig: function(){
						return {
							showProductFilter: false
						}
					}
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