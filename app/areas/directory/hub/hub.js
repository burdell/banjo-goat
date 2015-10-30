 
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
		ctrl.discussionUrls = {
			stories: routingService.generateUrl('stories.list', { nodeId: nodeUrl + '_stories' }),
			announcements: routingService.generateUrl('announcements.list', { nodeId: nodeUrl + '_announcements' })
		}
		ctrl.forumList = _.where(currentNode.children, { discussionStyle: 'forums' });

		var productStoriesNode = routingService.generateDiscussionUrl(nodeUrl, 'stories');
		ctrl.productStoriesUrl = routingService.generateUrl('stories.list', { nodeId: productStoriesNode });	

		var productAnnouncementsNode = routingService.generateDiscussionUrl(nodeUrl, 'announcements');
		ctrl.productAnnouncementsUrl = routingService.generateUrl('announcements.list', { nodeId: productAnnouncementsNode });	

	});

	debugger;

	var forumOrder = ['Alpha', 'Beta', 'Public'];
	_.extend(ctrl, {
		discussionsFeed: discussionsFeedFilter.initialData().content,
		discussionsFeedFilter: discussionsFeedFilter,
		storyList: storyData.content,
		forumOrder: function(forumNode){
			return _.indexOf(forumOrder, forumNode.name);
		},
		landingPages: routingService.landingPages(),
		getForumUrl: function(forumUrlCode){
			return routingService.generateUrl('forums.list', { nodeId: forumUrlCode });
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


