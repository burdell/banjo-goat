	'use strict';

	require('services/routing.js');
	var _ = require('underscore');


	var announcementsController = function($state, announcements, routingService){
		var ctrl = this;

		var announcementNodeId = $state.params.nodeId;
		console.log('hello there');
		
		_.extend(ctrl, {
			announcementList: announcements,
			getAnnouncementUrl: function(announcementData) {
				return routingService.generateUrl('announcements.detail', { nodeId: announcementNodeId, announcementId: announcementData.id });
			}
		});
	};
	announcementsController.$inject = ['$state', 'AnnouncementList', 'CommunityRoutingService', '$templateCache'];

	angular.module('community.announcements')
		.controller('CommunityAnnouncements', announcementsController);


