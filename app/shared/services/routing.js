(function(_) {
	'use strict';
	
	var routingService = function($location, communityRoutes){
		return {
			getCurrentArea: function(){
				return this.getArea($location.path());
			},
			getArea: function(url) {
				return url.split('/')[1]
			},
			areaSlugs: {
				announcements: 'announcements',
				bugs: 'bugs',
				featureRequests: 'features',
				forums: 'forums',
				qna: 'qna',
				stories: 'stories'
			},
			generateUrl: function(route, data){
				if (!route) return null;

				var routeList = route.split('.');
				
				var url = "";
				if (routeList.length > 0) {
					var areaName = routeList[0];
					var areaRoutes = routeList.length === 1 ? communityRoutes : communityRoutes[areaName];
					
					if (areaRoutes) {
						_.each(routeList, function(route){
							url += areaRoutes[route];
						});	
					}
				}
				
				_.each(data, function(value, key){
					url = url.replace(':' + key, value);
				});
				
				return url;
			},
			landingPages: function(){
				return [
					{ area: 'Announcements', href: communityRoutes.announcements.landing },
					{ area: 'Stories', href: communityRoutes.stories.landing  }
				]
			},
			generateDiscussionUrl: function(nodeName, discussionType) {
				var discussionCodes = {
					stories: '_stories',
					general: '_general',
					alpha: '_aforum',
					beta: '_bforum',
					announcements: '_announcements',
					features: '_features',
					bugs: '_bugs'
				};

				return nodeName + discussionCodes[discussionType.toLowerCase()];
			}
		};
	};
	routingService.$inject = ['$location', 'communityRoutes'];

	angular.module('community.services')
		.service('CommunityRoutingService', routingService);

}(window._));