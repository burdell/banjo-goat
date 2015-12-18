
'use strict';

var notificationService = function(localizationService, routingService, routesProvider){
	var notificationStrings = localizationService.data.directives.mainnavbar.notificationStrings;
	
	return {
		getActionString: function(notification) {
			var type = notification.type;
			
			switch(type) {
				case 'directReply':
					return notificationStrings.repliedTo;
					break;
			}
		},
		generateNotificationUrl: function (content) {
			var node = content.message.node;
			var discussionStyle = node.discussionStyle;

			var detailId = routesProvider.detailIds[discussionStyle];

			var routeDetails = {
				nodeId: node.urlCode
			};
			routeDetails[routesProvider.detailIds[discussionStyle]] = content.message.id;
			return routingService.generateUrl(discussionStyle + '.detail', routeDetails);
		},
		newDataCount: 0
	}
};
notificationService.$inject = ['CommunityLocalizationService', require('services/routing.js'), 'communityRoutes'];


var serviceName = 'CommunityNotificationsService';
angular.module('community.services')
	.service(serviceName, notificationService);

module.exports = serviceName;
