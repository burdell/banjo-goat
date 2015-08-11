(function(_){
	'use strict';

	var announcementsController = function($state, announcements, routingService){
		var ctrl = this;

		var announcementNodeId = $state.params.nodeId;

		_.extend(ctrl, {
			announcementList: announcements,
			getAnnouncementUrl: function(announcementData) {
				return routingService.generateUrl('announcements.detail', { nodeId: announcementNodeId, announcementId: announcementData.id });
			}
		});
	};
	announcementsController.$inject = ['$state', 'AnnouncementList', 'CommunityRoutingService'];

	angular.module('community.announcements')
		.controller('CommunityAnnouncements', announcementsController);

}(window._));
