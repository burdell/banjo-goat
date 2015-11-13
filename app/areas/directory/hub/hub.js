 
'use strict';

require('filters/extractkey.js');
require('filters/unescape.js');

require('directives/username/username.js');
require('directives/pulse/pulse.js');

var _ = require('underscore');

var hubController = function($q, $scope, communityApi, nodeServiceWrapper, routingService, discussionsFeedFilter, storyData, announcementsData){
	var ctrl = this;

	var nodeUrl = null;
	
	nodeServiceWrapper.get().then(function(nodeService){
		var currentNode = nodeService.CurrentNode;
		nodeUrl = currentNode.urlCode;

		ctrl.nodeDisplay = currentNode.description;
		
		var productStoriesNode = routingService.generateDiscussionUrl(nodeUrl, 'stories');
		ctrl.productStoriesUrl = routingService.generateUrl('stories.list', { nodeId: productStoriesNode });	

		var productAnnouncementsNode = routingService.generateDiscussionUrl(nodeUrl, 'announcements');
		ctrl.productAnnouncementsUrl = routingService.generateUrl('announcements.list', { nodeId: productAnnouncementsNode });	
	});


	var forumOrder = ['Alpha', 'Beta', 'Public'];
	_.extend(ctrl, {
		discussionsFeed: discussionsFeedFilter.initialData().content,
		discussionsFeedFilter: discussionsFeedFilter,
		storyList: storyData.content,
		generateAnnouncementUrl: function(announcement){
			return routingService.generateUrl('announcements.detail', { nodeId: nodeUrl, announcementId: announcement.id });
		},
		recentAnnouncements: announcementsData.content
	});
};
hubController.$inject = [
	'$q', 
	'$scope', 
	require('services/api.js'), 
	require('services/nodestructure.js'), 
	require('services/routing.js'), 
	'DiscussionsFeedFilter', 
	'StoryData',
	'AnnouncementsData'
];

angular.module('community.directory')
	.controller('Hub', hubController);


