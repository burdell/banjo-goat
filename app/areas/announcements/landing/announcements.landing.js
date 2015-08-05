(function(_){
	'use strict';

	var landingController = function(announcements){
		var ctrl = this;
		_.extend(ctrl, {
			announcementList: announcements
		});
	};
	landingController.$inject = ['AllAnnouncementsList'];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);

}(window._));
