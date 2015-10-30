
'use strict';

require('providers/routes.js');
var _ = require('underscore');

	var routingService = function($location, communityRoutes){
		return {
			getCurrentUrl: function(){
				return $location.url();
			},
			getCurrentArea: function(){
				return this.getArea($location.path());
			},
			getArea: function(url) {
				var areaName = url.split('/')[1];
				if (areaName === '' || areaName === 'user' ) {
					areaName = 'directory';
				}
				return areaName;
			},
			areaSlugs: {
				announcements: 'announcements',
				bugs: 'bugs',
				featureRequests: 'features',
				forums: 'forums',
				qna: 'qna',
				stories: 'stories'
			},
			generateUrl: function(route, data, hash){
				if (!route) return null;

				var routeList = route.split('.');
				
				var url = "";
				if (routeList.length > 0) {
					var areaName = routeList[0];
					var areaRoutes = routeList.length === 1 ? communityRoutes : communityRoutes[areaName];
					
					//ugh. 
					var isLandingRoute = routeList.length === 2 && routeList[1] === 'landing';
					if (isLandingRoute) {
						routeList.shift();
					}

					if (areaRoutes) {
						_.each(routeList, function(route){
							url += areaRoutes[route];
						});	
					}
				}
				
				_.each(data, function(value, key){
					url = url.replace(':' + key, value);
				});
				
				if (hash) {
					url += '#' + hash;
				}

				return url;
			},
			landingPages: function(){
				return [
					{ 
						area: 'Announcements', 
						href: communityRoutes.announcements.landing, 
						description: 'Announcements',
						callToAction: 'View Announcements' 
					},
					{ 
						area: 'Stories', 
						href: communityRoutes.stories.landing, 
						description: 'Stories',
						callToAction: 'Read Members Stories'  
					}
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

var serviceName = 'CommunityRoutingService';
angular.module('community.services')
	.service(serviceName, routingService);
	
module.exports = serviceName;
