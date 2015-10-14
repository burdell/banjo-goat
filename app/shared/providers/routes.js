
'use strict';

	var routesProvider = function(){
		var routeData = {
			announcements: {
			    announcements: '/announcements/:nodeId/',
			    list: 'list',
			    detail: ':announcementId',
			    landing: '/announcements/'
			},
			features: {
				features: '/features/:nodeId/',
				list: 'list',
				detail: ':featureRequestId'
			},
			forums: {
			    forums: '/forums/:nodeId/',
			    list: 'list',
			    message: 'message/:messageId',
			    newtopic: 'newtopic' 
			},
			stories: {
				landing: '/stories/',
				stories: '/stories/:nodeId/',
				list: 'list',
				detail: ':storyId',
				newstory: 'new'
			},
			directory: '/directory/',
			hub: '/directory/:nodeId/',
			feed: '/',
			userprofile: '/user/:userId',
			utils: {
				intRoute: function(route) {
					return '{' + route.replace(':', '') + ':int}'
				}
			}
		};

	this.routes = routeData;
	this.$get = function(){
		return this.routes;
	}
};

angular.module('community.providers')
	.provider('communityRoutes', routesProvider);
