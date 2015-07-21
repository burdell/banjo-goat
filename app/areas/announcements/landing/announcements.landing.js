(function(_){
	'use strict';

	var landingController = function(announcements, timelineService){
		var ctrl = this;

		_.extend(ctrl, {
			announcementList: timelineService.getTimelineData(announcements, 'postTime')
		});
	};
	landingController.$inject = ['AllAnnouncementsList', 'CommunityTimelineService'];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);

}(window._));
