(function(_){
	'use strict';

	var hubController = function($q, communityApi, nodeServiceWrapper, routingService, hubData){
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
			ctrl.forumList = _.where(currentNode.children, { discussionType: 'forums' });
			ctrl.getForumUrl = function(forumUrlCode){
				return routingService.generateUrl('forums.list', { nodeId: forumUrlCode });
			}
			ctrl.getStoryUrl = function(storyId) {
				return routingService.generateUrl('stories.detail', { nodeId: routingService.generateDiscussionUrl(nodeUrl, 'stories'), storyId: storyId })
			}
			ctrl.getAnnouncementUrl = function(announcementId) {
				return routingService.generateUrl('announcements.detail', { nodeId: routingService.generateDiscussionUrl(nodeUrl, 'announcements'), announcementId: announcementId })
			}

			var forumList = _.where(currentNode.children, { discussionType: 'forums' });
			getForumData(forumList);
		});

		function getForumData(availableForums) {
			var callList = [];
			_.each(availableForums, function(forum) {
				ctrl.forumMetaData.push({ 
					description: forum.description,
					urlCode: forum.urlCode 
				});
				callList.push(communityApi.Forums.messages(forum.urlCode, { limit: 4 }));
			});

			$q.all(callList).then(function(result) {
				ctrl.forumMessages = result;
			});
		};

		_.extend(ctrl, {
			featuredStory: hubData.stories.shift(),
			moreStories: hubData.stories,
			recentAnnouncements: hubData.announcements,
			getStoryPhoto: function(story) {
				if (!story) return;
				
				var coverPhoto = _.find(story.media, function(mediaObj) {
					return mediaObj.meta && mediaObj.meta.isCover && mediaObj.meta.isCover.value === "true"; 
				});
				return coverPhoto ? coverPhoto.url : 'http://i.imgur.com/TT7XC8m.jpg';
			},
			getForumMessageUrl: function(forumUrlCode, messageId){
				return routingService.generateUrl('forums.message', { nodeId: forumUrlCode, messageId: messageId });
			},
			forumMetaData: []
		});
	};
	hubController.$inject = ['$q', 'CommunityApiService', 'CommunityNodeService', 'CommunityRoutingService', 'HubData'];

	angular.module('community.directory')
		.controller('Hub', hubController);

}(window._));
