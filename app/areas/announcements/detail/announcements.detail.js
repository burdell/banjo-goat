(function(_){
	'use strict';

	function AnnouncementListController ($state, announcementDetail){
		var ctrl = this;
		
		_.extend(ctrl, {
			currentAnnouncement: announcementDetail.originalMessage,
			currentComments: announcementDetail.comments
		});
	}
	AnnouncementListController.$inject = ['$state', 'AnnouncementDetail'];

	angular.module('community.announcements')
		.controller('AnnouncementDetail', AnnouncementListController);

}(window._));
