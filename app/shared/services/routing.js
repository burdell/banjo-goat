
'use strict';

var _ = require('underscore');

	var routingService = function($location, $stateParams, localizationService, communityRoutes){
		var areaStrings = localizationService.data.core.areas;

		var localeToArea = _.invert(require('locale/routing.locale.js').routing);
		function localeMapper(string) {
			return localeToArea[string];
		}

		return {
			getCurrentUrl: function(){
				return $location.url();
			},
			getCurrentArea: function(){
				return this.getArea($location.path());
			},
			getArea: function(url) {
				var areaName = localeMapper(url.split('/')[1]);
				if (!areaName || areaName === '/' || areaName === 'user' || areaName === 'notifications' || areaName === 'search' || areaName === 'inbox' ) {
					areaName = 'directory';
				}
				return areaName;
			},
			getDetailId: function(areaName) {
				return communityRoutes.detailIds[areaName];
			},
			getCurrentId: function(){
				var detailId = this.getDetailId(this.getCurrentArea());
				return $stateParams[detailId];

			},
			generateUrl: function(route, data, params){
				if (!route) return null;

				var routeList = route.split('.');
				
				var url = "";
				if (routeList.length > 0) {
					var areaName = routeList[0];

					var routeTester = communityRoutes[areaName];
					var areaRoutes = _.isString(routeTester) ? communityRoutes : routeTester;
					
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
				
				if (params) {
					if (_.isObject(params)) {
						//object params is query params
						var numberOfParams = _.keys(params).length;
						url += '?'
						_.each(params, function(param, key, index){
							url += key + '=' + param;
							if (index < numberOfParams) {
								url += '&';
							} 
						});
					} else { 
						//string...params is hash
						url += '#' + params;
					}
				}

				return url;
			},
			landingPages: function(){
				return [
					{ 
						area: 'Announcements', 
						href: communityRoutes.announcements.landing, 
						description: areaStrings.announcements,
						callToAction: 'View Announcements' 
					},
					{ 
						area: 'Stories', 
						href: communityRoutes.stories.landing, 
						description: areaStrings.stories,
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
routingService.$inject = ['$location', '$stateParams', 'CommunityLocalizationService', require('providers/routes.js')];

var serviceName = 'CommunityRoutingService';
angular.module('community.services')
	.service(serviceName, routingService);
	
module.exports = serviceName;
