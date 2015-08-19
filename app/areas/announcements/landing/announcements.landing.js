(function(_){
	'use strict';

	var landingController = function(announcements, routingService){
		var ctrl = this;
		_.extend(ctrl, {
			announcementList: announcements,
			generateAnnouncementUrl: function(announcementData){
				var nodeId = routingService.generateDiscussionUrl(announcementData.product, 'announcements');
				return routingService.generateUrl('announcements.detail', { nodeId: nodeId, announcementId: announcementData.id });
			}
		});
	};
	landingController.$inject = ['AllAnnouncementsList', 'CommunityRoutingService'];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);

}(window._));
