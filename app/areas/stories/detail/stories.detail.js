(function(_){
	'use strict';

	function StoryDetailController ($anchorScroll, $location, $scope, communityApi, breadcrumbService, filterService, currentUserService, storyThread, storyDefaults){
		var ctrl = this;

		storyThread.comments.content.shift();

		var story = storyThread.originalMessage;
		var storyAuthor = story.message.insertUser;

		var cover = _.find(story.media, function(mediaObj) {
			return mediaObj.meta && mediaObj.meta.isCover && mediaObj.meta.isCover.value === "true";
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

		_.extend(ctrl, {
			story: story,
			discussion: story.message,
			storyAuthor: storyAuthor,
			comments: storyThread.comments,
			productList: _.pluck(story.productsUsed, 'productKey'),
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
		'CurrentUserService',
		'StoryThread', 
		'StoryDefaults'
	];

	angular.module('community.stories')
		.controller('StoryDetail', StoryDetailController);

}(window._));
