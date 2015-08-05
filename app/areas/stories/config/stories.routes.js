(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
		$locationProvider.html5Mode(true);

		var storyDefaults = function(){
			return {
				coverPhoto: "http://i.imgur.com/TT7XC8m.jpg"
			}
		};

		var storiesRoutes = routesProvider.routes.stories;
		$stateProvider
			.state('storiesLanding', {
				url: storiesRoutes.storiesLanding,
				templateUrl: 'stories/landing/stories.landing.html',
				controller: 'StoriesList as vm',
				resolve: {
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
				url: storiesRoutes.stories,
				templateUrl: 'stories/stories.html',
				controller: 'Stories as vm',
				resolve: {
					StoryDefaults: function(){
						return {
							coverPhoto: "http://i.imgur.com/TT7XC8m.jpg"
						}
					}
				},
			})
			.state('stories.list', {
				url: storiesRoutes.list +'?offset&sort', 
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
				url: storiesRoutes.detail, 
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
				url: storiesRoutes.newstory,
				views: {
					'mainContent': {
						templateUrl: 'stories/newstory/stories.newstory.html',
						controller: 'NewStory as vm'
					}
				}
			})
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];




		angular.module('community.stories')
			.config(config);
}());
