(function(_){
	'use strict';

	var hubController = function($q, $scope, communityApi, nodeServiceWrapper, routingService, hubData){

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

		var NUMBER_OF_FORUM_MESSAGES = 4;
		function getForumData(availableForums) {
			var callList = [];
			_.each(availableForums, function(forum) {
				ctrl.forumMetaData.push({
					name: forum.name,
					description: forum.description,
					urlCode: forum.urlCode,
					offset: NUMBER_OF_FORUM_MESSAGES,
					loadingMessages: false 
				});
				callList.push(communityApi.Forums.messages(forum.urlCode, { per_page: NUMBER_OF_FORUM_MESSAGES }));
			});

			$q.all(callList).then(function(result) {
				console.log(result);
				ctrl.forumMessages = result;
			});
		};

		var forumOrder = ['Alpha', 'Beta', 'General'];
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
			forumMetaData: [],
			forumOrder: function(forumNode){
				return _.indexOf(forumOrder, forumNode.name);
			},
			loadMoreForumData: function(index) {
				var forum = ctrl.forumMetaData[index];
				forum.offset += NUMBER_OF_FORUM_MESSAGES;
				forum.loadingMessages = true;

				var forumMessages = ctrl.forumMessages[index];
				communityApi.Forums.messages(forum.urlCode, { per_page: NUMBER_OF_FORUM_MESSAGES, offset: forum.offset })
					.then(function(result){
						forumMessages.content = forumMessages.content.concat(result.content);
					})
					.finally(function(){
						forum.loadingMessages = false;
					});
			}
		});
	};
	hubController.$inject = ['$q', '$scope', 'CommunityApiService', 'CommunityNodeService', 'CommunityRoutingService', 'HubData'];

	angular.module('community.directory')
		.controller('Hub', hubController);

}(window._));
