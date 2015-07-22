(function(_){
	'use strict';

	var landingController = function(announcements, timelineService){
		var ctrl = this;

		var announcementData = timelineService.getTimelineData(announcements, 'postTime');
		var yearShown = null;
		if (announcementData.length > 0) {
			//show the most recent year
			yearShown = announcementData[0].year;
		}

		_.extend(ctrl, {
			announcementList: announcementData,
			yearShown: yearShown
		});
	};
	landingController.$inject = ['AllAnnouncementsList', 'CommunityTimelineService'];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);

}(window._));
