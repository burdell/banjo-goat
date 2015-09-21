(function(_){
	'use strict';

	var landingController = function($scope, announcements, breadcrumbService, routingService){
		breadcrumbService.setCurrentBreadcrumb('All Announcements');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
		
		var ctrl = this;
		_.extend(ctrl, {
			announcementList: announcements,
			generateAnnouncementUrl: function(announcementData){
				var nodeId = routingService.generateDiscussionUrl(announcementData.product, 'announcements');
				return routingService.generateUrl('announcements.detail', { nodeId: nodeId, announcementId: announcementData.id });
			}
		});
	};
	landingController.$inject = ['$scope', 'AllAnnouncementsList', 'CommunityBreadcrumbService', 'CommunityRoutingService'];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);

}(window._));
