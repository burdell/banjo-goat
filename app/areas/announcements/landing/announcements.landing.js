
	'use strict';

	require('directives/productnavigator/productnavigator.js');

	var _ = require('underscore');

	var landingController = function($scope, announcements, breadcrumbService, routingService){
		breadcrumbService.setCurrentBreadcrumb('All Announcements');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var announcementData = announcements.content;
		
		var ctrl = this;
		_.extend(ctrl, {
			announcementList: announcementData,
			generateAnnouncementUrl: function(announcementData){
				var nodeId = routingService.generateDiscussionUrl(announcementData.product, 'announcements');
				return routingService.generateUrl('announcements.detail', { nodeId: nodeId, announcementId: announcementData.id });
			}
		});
	};
	landingController.$inject = ['$scope', 'AllAnnouncementsList', require('services/breadcrumb.js'), require('services/routing.js')];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);


