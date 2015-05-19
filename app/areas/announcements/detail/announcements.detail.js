(function(_){
	'use strict';

	function AnnouncementListController ($state, announcementDetail){
		var ctrl = this;
		
		_.extend(ctrl, {
			currentAnnouncement: announcementDetail.originalMessage,
			currentComments: announcementDetail.comments,
			replyInProgress: false,
			showReply: function(){
				ctrl.replyInProgress = true;
			},
			cancelReply: function(){
				ctrl.replyInProgress = false;
			}
		});
	}
	AnnouncementListController.$inject = ['$state', 'AnnouncementDetail'];

	angular.module('community.announcements')
		.controller('AnnouncementDetail', AnnouncementListController);

}(window._));
