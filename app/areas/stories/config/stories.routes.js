
'use strict';

require('providers/routes.js');
require('providers/defaults.js');

require('services/api.js');
require('services/filter.js');

var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider, defaultsProvider) {
	$locationProvider.html5Mode(true);

	var storyDefaults = function(){
		return {
			coverPhoto:  defaultsProvider.defaults.noPhoto
		}
	};

	var storiesRoutes = routesProvider.routes.stories;

	$stateProvider
		.state('storiesLanding', {
			url: storiesRoutes.landing,
			templateUrl: 'stories/landing/stories.landing.html',
			controller: 'StoriesList as vm',
			resolve: {
				StoryDefaults: storyDefaults,
				StoryListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
					return filterService.getNewFilter({ 
						filterFn: communityApi.Stories.all,
						constants: {
							per_page: 30,
							sortDir: 'DESC'
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
							per_page: 30,
							sortDir: 'DESC'
						},
						persistFilterModel: false,
						autoInitModel: false 
					});
				}]
			},
			reloadOnSearch: false
		})
		.state('stories.detail', {
			url:  routesProvider.routes.utils.intRoute(storiesRoutes.detail), 
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
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider', 'communityDefaultsProvider'];




	angular.module('community.stories')
		.config(config);
