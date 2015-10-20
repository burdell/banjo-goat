 
'use strict';

require('services/api.js');
require('services/nodestructure.js');
require('services/routing.js');

require('filters/extractkey.js');
require('filters/unescape.js');

require('directives/username/username.js');

var _ = require('underscore');

var hubController = function($q, $scope, communityApi, nodeServiceWrapper, routingService, discussionsFeedFilter, storyData){
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
		ctrl.productStoriesUrl = routingService.generateUrl('stories.list', { nodeId: nodeUrl });		
	});

	var forumOrder = ['Alpha', 'Beta', 'Public'];
	_.extend(ctrl, {
		discussionsFeed: discussionsFeedFilter.initialData().content,
		discussionsFeedFilter: discussionsFeedFilter,
		storyList: storyData.content,
		getStoryPhoto: function(story) {
			if (!story) return;
			var coverPhoto = _.find(story.media, function(mediaObj) {
				return mediaObj.meta && mediaObj.meta.isCover && mediaObj.meta.isCover.value === "true"; 
			});
			return coverPhoto ? coverPhoto.url : 'http://i.imgur.com/TT7XC8m.jpg';
		},
		forumOrder: function(forumNode){
			return _.indexOf(forumOrder, forumNode.name);
		},
		landingPages: routingService.landingPages(),
		getForumUrl: function(forumUrlCode){
			return routingService.generateUrl('forums.list', { nodeId: forumUrlCode });
		}
	});
};
hubController.$inject = ['$q', '$scope', 'CommunityApiService', 'CommunityNodeService', 'CommunityRoutingService', 'DiscussionsFeedFilter', 'StoryData'];

angular.module('community.directory')
	.controller('Hub', hubController);


