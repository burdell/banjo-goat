
'use strict';

var _ = require('underscore');

var routesProvider = function(){

	var detailIds = {
		announcements: 'announcementId',
		features: 'featureRequestId',
		forums: 'messageId',
		stories: 'storyId',
		user: 'userId',
		inbox: 'messageId'
	};

	var standardNewTopic = 'newtopic';
	var standardEdit = ':messageType/:id/edit'; 

	var routeData = {
		announcements: {
		    announcements: '/announcements/:nodeId/',
		    list: 'list',
		    detail: ':' + detailIds.announcements,
		    landing: '/announcements/',
		    newtopic: standardNewTopic,
		    edit: standardEdit
		},
		features: {
			features: '/features/:nodeId/',
			list: 'list',
			detail: ':' + detailIds.features,
			newtopic: standardNewTopic,
			edit: standardEdit
		},
		forums: {
		    forums: '/forums/:nodeId/',
		    list: 'list',
		    detail: 'message/:' + detailIds.forums,
		    newtopic: standardNewTopic,
		    edit: standardEdit 
		},
		stories: {
			landing: '/stories/',
			stories: '/stories/:nodeId/',
			list: 'list',
			detail: ':' + detailIds.stories,
			newstory: 'new',
			edit: ':' + detailIds.stories + '/edit'
		},
		inbox: {
			inbox: '/inbox',
			detail: '/:' + detailIds.inbox,
			newtopic: '/new'
		},
		directory: '/directory/',
		hub: '/directory/:nodeId/',
		feed: '/',
		notifications: '/notifications',
		userprofile: '/user/:' + detailIds.user,
		searchpage: '/search',
		utils: {
			intRoute: function(route) {
				return '{' + route.replace(':', '') + ':int}'
			}
		},
		detailIds: detailIds,
		standardRoutes: {
			newTopic: function(options, isEdit){
				var standardOptions = { 
					url: standardNewTopic,
					views: {
						'mainContent': {
							templateUrl: 'pages/newtopic/newtopic.html',
							controller: isEdit ? 'EditMessage as vm' : 'NewTopic as vm'
						}
					},
					resolve: {
						MessageDetail: function(){
							return null;
						}
					}			
				};
				return !options ? standardOptions : _.extend(standardOptions, options); 
			}
		}
 	}
	
	this.routes = routeData;
	this.$get = function(){
		return this.routes;
	}
};

var providerName = 'communityRoutes';
angular.module('community.providers')
	.provider(providerName, routesProvider);
module.exports = providerName;
