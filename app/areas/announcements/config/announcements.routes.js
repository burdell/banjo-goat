'use strict';

require('shared/services/api.js')
require('shared/providers/routes.js');

var config = function($stateProvider, $urlRouterProvider, $locationProvider, routesProvider) {
		$locationProvider.html5Mode(true);

		var announcementsRoutes = routesProvider.routes.announcements;
		$stateProvider
			.state('announcementsLanding', {
				url: announcementsRoutes.landing,
				controller: 'AnnouncementsLanding as vm',
				templateUrl: 'announcements/landing/announcements.landing.html',
				resolve: {
					AllAnnouncementsList: ['CommunityApiService', function(communityApi){
						// return communityApi.Announcements.count()
						// 	.then(function(result){
						// 		return communityApi.Announcements.all({ limit: result.count, sort: 'postdate' });
						// 	})
						// 	.then(function(result) {
						// 		return result.content;
						// 	});
						return communityApi.Announcements.all({ per_page: 100 });
					}]
				}
			})
			.state('announcements', {
				url: announcementsRoutes.announcements,
				abstract: true,
				templateUrl: 'announcements/announcements.html',
			})
			.state('announcements.list', {
				url: 'list',
				templateUrl: 'announcements/list/announcements.list.html',
				views: {
					'mainContent': {
						templateUrl: 'announcements/list/announcements.list.html',
						controller: 'CommunityAnnouncements as vm',
					}
				},
				resolve: {
					AnnouncementList: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
						return communityApi.Announcements.announcements($stateParams.nodeId, { per_page: 100, sortField: 'postDate' }).then(function(result){
							return result.content;
						});
					}]
				}
			})
			.state('announcements.detail', {
				url: announcementsRoutes.detail, 
				views: {
					'mainContent': {
						templateUrl: 'announcements/detail/announcements.detail.html',
						controller: 'AnnouncementDetail as vm'
					}
				},
				resolve: {
					AnnouncementDetail: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
						return communityApi.Announcements.thread($stateParams.announcementId, { limit: 10, offset: 0 });
					}]
				}
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'communityRoutesProvider'];

	angular.module('community.announcements')
		.config(config);
