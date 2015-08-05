(function(_) {
	'use strict';
	
	var routingService = function($location, communityRoutes){
		return {
			getCurrentArea: function(){
				return $location.path().split('/')[1];
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
					var areaRoutes = communityRoutes[areaName];
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
			}
		};
	};
	routingService.$inject = ['$location', 'communityRoutes'];

	angular.module('community.services')
		.service('CommunityRoutingService', routingService);

}(window._));