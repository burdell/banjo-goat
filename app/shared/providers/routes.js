
'use strict';

	var routesProvider = function(){

		var detailIds = {
			announcements: 'announcementId',
			features: 'featureRequestId',
			forums: 'messageId',
			stories: 'storyId',
			user: 'userId'
		};

		var routeData = {
			announcements: {
			    announcements: '/announcements/:nodeId/',
			    list: 'list',
			    detail: ':' + detailIds.announcements,
			    landing: '/announcements/',
			},
			features: {
				features: '/features/:nodeId/',
				list: 'list',
				detail: ':' + detailIds.features
			},
			forums: {
			    forums: '/forums/:nodeId/',
			    list: 'list',
			    detail: 'message/:' + detailIds.forums,
			    newtopic: 'newtopic' 
			},
			stories: {
				landing: '/stories/',
				stories: '/stories/:nodeId/',
				list: 'list',
				detail: ':' + detailIds.stories,
				newstory: 'new'
			},
			directory: '/directory/',
			hub: '/directory/:nodeId/',
			feed: '/',
			notifications: '/alerts',
			userprofile: '/user/:' + detailIds.user,
			searchpage: '/search',
			utils: {
				intRoute: function(route) {
					return '{' + route.replace(':', '') + ':int}'
				}
			},
			detailIds: detailIds
		};

	this.routes = routeData;
	this.$get = function(){
		return this.routes;
	}
};

var providerName = 'communityRoutes';
angular.module('community.providers')
	.provider(providerName, routesProvider);
module.exports = providerName;
