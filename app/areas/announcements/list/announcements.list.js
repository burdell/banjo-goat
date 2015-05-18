(function(_){
	'use strict';

	var announcementsController = function($state, announcements){
		var ctrl = this;

		_.extend(ctrl, {
			announcementList: announcements.collection
		});

		//redirect to newest announcement if no specific announcement
		if (!$state.params.announcementId) {
			$state.go('announcements.detail', { announcementId: ctrl.announcementList[0].id });
		}

	};
	announcementsController.$inject = ['$state', 'AnnouncementList'];

	angular.module('community.announcements')
		.controller('CommunityAnnouncements', announcementsController);

}(window._));
