(function(){
	'use strict';

	var config = function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('announcements', {
				url: '/announcements/:nodeId/',
				templateUrl: 'announcements/list/announcements.list.html',
				controller: 'CommunityAnnouncements as vm',
				resolve: {
					CommunityNodeStructure: ['$stateParams', 'CommunityNodeService', function($stateParams, nodeService){
						return nodeService.setNodeStructure($stateParams.nodeId);
					}],
					AnnouncementList: ['$stateParams', 'CommunityApiService', function($stateParams, communityApi){
						return communityApi.Forums.messages($stateParams.nodeId);
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
						return communityApi.Forums.thread($stateParams.announcementId, { limit: 300 });
					}]
				}
			});
		};
		config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];




		angular.module('community.announcements')
			.config(config);
}());