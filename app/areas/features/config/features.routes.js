
'use strict';

require('services/routing.js');
require('services/filter.js');
require('services/api.js');

require('providers/routes.js');

var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
	$locationProvider.html5Mode(true);

	var featureRoutes = routesProvider.routes.features;
	var standardRoutes = routesProvider.routes.standardRoutes;
	$stateProvider
		.state('features', {
			abstract: true,
			url: featureRoutes.features,
			templateUrl: 'features/features.html'
		})
		.state('features.newtopic', standardRoutes.newTopic())
		.state('features.list', {
			url: featureRoutes.list + '?offset&sort&request&status&severity&attachments', 
			views: {
				'mainContent': {
					templateUrl: 'features/list/features.list.html',
					controller: 'FeaturesList as vm'
				}
			},
			resolve: {
				FeaturesListFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
					return filterService.getNewFilter({ 
						filterFn: communityApi.Features.features,
						filterArguments: [ $stateParams.nodeId ], 
						constants: {
							limit: 30
						} 
					});
				}]
			},
			reloadOnSearch: false
		})
		.state('features.edit', standardRoutes.newTopic({
			url: featureRoutes.edit,
			resolve: {
				MessageDetail: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
					if ($stateParams.messageType === 'comment') {
						return communityApi.Messages.message(Number($stateParams.id));
					} else {
						return communityApi.Features.message(Number($stateParams.id));
					}
				}]
			}
		}, true))
		.state('features.detail', {
			url: featureRoutes.detail,
			views: {
				'mainContent': {
					templateUrl: 'features/detail/features.detail.html',
					controller: 'FeaturesDetail as vm'
				}
			},
			resolve: {
				FeaturesDetail: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
					return communityApi.Features.message($stateParams.featureRequestId).then(function(result){
						return result;
					});
				}],
				FeaturesCommentFilter: ['$stateParams', 'CommunityApiService', 'CommunityFilterService', function($stateParams, communityApi, filterService){
					return filterService.getNewFilter({ 
						filterFn: communityApi.Features.comments, 
						filterArguments: [ $stateParams.featureRequestId ],
						filterContext: communityApi.Features,
						persistFilterModel: false,
						autoInitModel: false,
						constants: {
							per_page: 10,
							sortDir: 'ASC',
							sortField: 'postDate'
						},
						saveMeta: true,
						targetCommentHash: true
					});
				}]
			}
		})
	};
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
	
	angular.module('community.features')
		.config(config);
