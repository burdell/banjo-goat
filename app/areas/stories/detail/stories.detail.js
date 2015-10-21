
'use strict';

require('services/api.js');
require('services/breadcrumb.js');
require('services/filter.js');
require('services/currentuser.js');
require('services/nodestructure.js');
require('services/routing.js');

require('providers/routes.js');

require('directives/commentform/commentform.js');
require('directives/commentlist/commentlist.js');
require('directives/username/username.js');
require('directives/map/map.js');


require('filters/sanitize.js');

var _ = require('underscore');

function StoryDetailController ($anchorScroll, $location, $scope, communityApi, breadcrumbService, filterService, nodeServiceWrapper, currentUserService, storyThread, storyDefaults, routingService, routesProvider){
	var ctrl = this;

	storyThread.comments.content.pop();

	var story = storyThread.originalMessage;
	var storyAuthor = story.message.insertUser;

	var cover = _.find(story.media, function(mediaObj) {
		return mediaObj.meta && mediaObj.meta.isCover;
	}) || { url: storyDefaults.coverPhoto };

		var refreshComments = function(){
			communityApi.Stories.comments(story.id).then(function(result){
				ctrl.comments = result.collection;
				ctrl.commentData = result.next;
				ctrl.comment.replyText = null;
				ctrl.toggleCommentForm();
			}).finally(function(){
				ctrl.comment.submittingComment = false;
			});
		};

		nodeServiceWrapper.get().then(function(nodeService){
			ctrl.getProductName = function(nodeId){
				var node = nodeService.getNode(Number(nodeId));
				return node ? node.name : nodeId;
			},

			ctrl.getProduct = function(nodeId){
				var node = nodeService.getNode(Number(nodeId));
				return node;
			},

			ctrl.getProductUrl = function(nodeId){
				var node = nodeService.getNode(Number(nodeId));
				if (!node) debugger;
				var route = node.discussionStyle === 'category' ? 'hub' : 'forums.list';
				return routingService.generateUrl(route, { nodeId: node.urlCode });
			},

			ctrl.getProductIcon = function(nodeId){
				var node = nodeService.getNode(Number(nodeId));
				return node.iconClass;
			}
						
		});

		_.extend(ctrl, {
			story: story,
			discussion: story.message,
			storyAuthor: storyAuthor,
			comments: storyThread.comments,
			productList: story.productsUsed,
			cover: cover,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Forums.comments, 
				filterArguments: [ story.id ],
				persistFilterModel: false,
				setInitialData: false
			}),
			toggleCommentForm: function(scroll) {
				ctrl.replyInProgress = !ctrl.replyInProgress;

			//only scroll if we're showing comment form
			if (ctrl.replyInProgress && scroll) {
				$location.hash('comment');
				$anchorScroll('#comment');
			}
		},
		cancelReply: function(){
			ctrl.replyInProgress = false;
		},
		notCoverPhoto: function(imageObj) {
			return !(ctrl.cover && (ctrl.cover === imageObj));
		},
		submitReply: function(commentText) {
			ctrl.comment.submittingComment = true;
			communityApi.Stories.comments({
				body: ctrl.comment.replyText,
				topicId: story.id,
				parentId: story.id
			}).then(
				function(result){
					refreshComments();
				},
				function(){
					ctrl.comment.submittingComment = false;
				}
			);
		},
		coordinates: {
			locLat: story.locLat,
			locLon: story.locLon,
			locName: story.locName
		}
	});

	breadcrumbService.setCurrentBreadcrumb(story.subject);
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});
}
StoryDetailController.$inject = [
	'$anchorScroll',
	'$location',
	'$scope', 
	'CommunityApiService', 
	'CommunityBreadcrumbService',  
	'CommunityFilterService', 
	'CommunityNodeService',
	'CurrentUserService',
	'StoryThread', 
	'StoryDefaults',
	'CommunityRoutingService',
	'communityRoutes',
];

angular.module('community.stories')
	.controller('StoryDetail', StoryDetailController);


