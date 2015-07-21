(function(_){
	'use strict';

	var announcementsController = function($state, announcements){
		var ctrl = this;

		_.extend(ctrl, {
			announcementList: announcements,
			itemTemplate: '<a ui-sref="announcements.detail({ announcementId: timelineItem.ngModel.id })">{{ timelineItem.ngModel.subject }}</a>'
		});

		//redirect to newest announcement if no specific announcement
		if (!$state.params.announcementId) {
			var latestAnnouncement = _.last(ctrl.announcementList);
			$state.go('announcements.detail', { announcementId: latestAnnouncement.id }, { location: 'replace' });
		}

	};
	announcementsController.$inject = ['$state', 'AnnouncementList'];

	angular.module('community.announcements')
		.controller('CommunityAnnouncements', announcementsController);

}(window._));
