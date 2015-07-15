(function(_){
	'use strict';

	function StoryDetailController ($anchorScroll, $location, $scope, communityApi, breadcrumbService, filterService, mediaService, currentUserService, storyThread, storyDefaults){
		var ctrl = this;
		var story = storyThread.originalMessage;
		var storyAuthor = story.discussion.author;

		var cover = _.find(story.media, function(mediaObj) {
			return mediaObj.meta && mediaObj.meta.isCover && mediaObj.meta.isCover.value === "true";
		}) || { url: storyDefaults.coverPhoto };

		var currentUser = currentUserService.get();


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
			discussion: story.discussion,
			storyAuthor: storyAuthor,
			comments: storyThread.comments,
			commentData: storyThread.nextCommentMetaData,
			productList: _.pluck(story.productsUsed, 'productKey'),
			cover: cover,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Forums.comments, 
				filterArguments: [ storyThread.originalMessage.id ],
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
					currentUserId: currentUser.id,
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
			isVideo: mediaService.isVideo
		});

		breadcrumbService.setCurrentBreadcrumb(this.story.discussion.subject);
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
		'CommunityMediaService',
		'CurrentUserService',
		'StoryThread', 
		'StoryDefaults'
	];

	angular.module('community.stories')
		.controller('StoryDetail', StoryDetailController);

}(window._));
