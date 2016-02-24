
	'use strict';

	require('directives/productnavigator/productnavigator.js');

	require('services/localization.js');

	var _ = require('underscore');

	var landingController = function($scope, announcements, breadcrumbService, localizationService, routingService){
		breadcrumbService.setCurrentBreadcrumb(localizationService.data.announcements.landing.allAnnouncements);

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var announcementData = announcements.content;
		
		var ctrl = this;
		_.extend(ctrl, {
			announcementList: announcementData,
			generateAnnouncementUrl: function(announcementData){
				return routingService.generateUrl('announcements.detail', { nodeId: announcementData.topic.node.urlCode, announcementId: announcementData.id });
			}
		});
	};
	landingController.$inject = ['$scope', 'AllAnnouncementsList', require('services/breadcrumb.js'), 'CommunityLocalizationService', require('services/routing.js')];

	angular.module('community.announcements')
		.controller('AnnouncementsLanding', landingController);


