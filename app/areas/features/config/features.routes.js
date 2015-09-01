(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
		$locationProvider.html5Mode(true);

		var featureRoutes = routesProvider.routes.features;
		$stateProvider
			.state('features', {
				abstract: true,
				url: featureRoutes.features,
				templateUrl: 'features/features.html'
			})
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
							constants: {
								limit: 5
							}
						});
					}]
				}
			})
			.state('features.newfeature', {
				url: featureRoutes.newfeature,
				views: {
					'mainContent': {
						templateUrl: 'features/newfeature/features.newfeature.html',
						contrller: 'NewFeature as vm'
					}
				}

			})
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];
		
		angular.module('community.features')
			.config(config);
}());