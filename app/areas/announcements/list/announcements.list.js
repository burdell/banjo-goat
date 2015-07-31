(function(_){
	'use strict';

	var announcementsController = function($state, announcements, nodeService){
		var ctrl = this;

		_.extend(ctrl, {
			announcementList: announcements,

		});
	};
	announcementsController.$inject = ['$state', 'AnnouncementList'];

	angular.module('community.announcements')
		.controller('CommunityAnnouncements', announcementsController);

}(window._));
