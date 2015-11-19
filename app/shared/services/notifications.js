
'use strict';

var notificationService = function(routingService, routesProvider){
	return {
		getActionString: function(notification) {
			var type = notification.type;
			
			switch(type) {
				case 'directReply':
					return 'replied to you in';
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
notificationService.$inject = [require('services/routing.js'), 'communityRoutes'];


var serviceName = 'CommunityNotificationsService';
angular.module('community.services')
	.service(serviceName, notificationService);

module.exports = serviceName;
