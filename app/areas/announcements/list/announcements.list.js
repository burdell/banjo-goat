(function(_){
	'use strict';

	var announcementsController = function($state, announcements, nodeService){
		var ctrl = this;

		_.extend(ctrl, {
			announcementList: announcements,
			currentNode: nodeService.CurrentNode
		});

		//redirect to newest announcement if no specific announcement
		if (!$state.params.announcementId) {
			var latestAnnouncement = _.last(ctrl.announcementList);
			$state.go('announcements.detail', { announcementId: latestAnnouncement.id }, { location: 'replace' });
		}

	};
	announcementsController.$inject = ['$state', 'AnnouncementList', 'CommunityNodeService'];

	angular.module('community.announcements')
		.controller('CommunityAnnouncements', announcementsController);

}(window._));
