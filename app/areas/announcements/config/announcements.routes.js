(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('announcementsLanding', {
				url: '/announcements/',
				templateUrl: 'announcements/landing/announcements.landing.html'
			})
			.state('announcements', {
				url: '/announcements/:nodeId/',
				templateUrl: 'announcements/list/announcements.list.html',
				controller: 'CommunityAnnouncements as vm',
				resolve: {
					AnnouncementList: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
						var nodeId = $stateParams.nodeId;
						return communityApi.Forums.messageCount(nodeId)
							.then(function(result){
								return communityApi.Forums.messages($stateParams.nodeId, { limit: result.count, sort: 'postdate' });
							})
							.then(function(result) {
								return result.collection;
							});
					}]
				}
			})
			.state('announcements.detail', {
				url: ':announcementId', 
				views: {
					'mainContent': {
						templateUrl: 'announcements/detail/announcements.detail.html',
						controller: 'AnnouncementDetail as vm'
					}
				},
				resolve: {
					AnnouncementDetail: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
						return communityApi.Forums.thread($stateParams.announcementId, { limit: 10, offset: 0 });
					}]
				}
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];




		angular.module('community.announcements')
			.config(config);
}());