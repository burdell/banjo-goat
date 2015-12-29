
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

	var strings = require('locale/routing.locale.js').routing;
	
	var standardNewTopic = strings.newtopic;
	var standardEdit = ':messageType/:id/' + strings.edit; 


	var routeData = {
		announcements: {
		    announcements: '/' + strings.announcements + '/:nodeId/',
		    list: strings.list,
		    detail: ':' + detailIds.announcements,
		    landing: '/' +  strings.announcements  +'/',
		    newtopic: standardNewTopic,
		    edit: standardEdit
		},
		features: {
			features: '/' +  strings.features + '/:nodeId/',
			list: strings.list,
			detail: ':' + detailIds.features,
			newtopic: standardNewTopic,
			edit: standardEdit
		},
		forums: {
		    forums: '/' + strings.forums + '/:nodeId/',
		    list: 'list',
		    detail:  strings.message + '/:' + detailIds.forums,
		    newtopic: standardNewTopic,
		    edit: standardEdit 
		},
		stories: {
			landing: '/' + strings.stories + '/',
			stories: '/' + strings.stories + '/:nodeId/',
			list: strings.list,
			detail: ':' + detailIds.stories,
			newstory: 'new',
			edit: ':' + detailIds.stories + '/' + strings.edit
		},
		inbox: {
			inbox: '/' + strings.inbox,
			detail: '/:' + detailIds.inbox,
			newtopic: '/' + strings.newString
		},
		directory: '/' + strings.directory + '/',
		hub: '/' + strings.directory + '/:nodeId/',
		feed: '/',
		notifications: '/' + strings.notifications,
		userprofile: '/' + strings.user + '/:' + detailIds.user,
		searchpage: '/' + strings.search,
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
