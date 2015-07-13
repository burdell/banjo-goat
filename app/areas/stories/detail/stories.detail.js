(function(_){
	'use strict';

	function StoryDetailController ($anchorScroll, $location, $scope, communityApi, breadcrumbService, filterService, storyThread, storyDefaults){
		var ctrl = this;
		var story = storyThread.originalMessage;
		var storyAuthor = story.author;
		
		_.extend(ctrl, {
			story: story,
			storyAuthor: storyAuthor,
			comments: storyThread.comments,
			commentData: storyThread.nextCommentMetaData,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Forums.comments, 
				filterArguments: [ storyThread.originalMessage.id ],
				persistFilterModel: false,
				setInitialData: false
			}),
			showSidebar: function(){

				if( story.location || story.projectRole ||  
					story.finishDate || story.numberOfUsers ||
					story.budgetAmount || story.dataRequirement ||
					story.bandwidth) {
					return true;
				}
				return false;
			},
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
			}
		});

		var cover = _.where(this.story.mediaList, { isCover: true });
		if (!cover || cover.length === 0) {
			cover = {
				url: storyDefaults.coverPhoto
			}
		}
		ctrl.cover = cover;

		breadcrumbService.setCurrentBreadcrumb(this.story.subject);
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
		'StoryThread', 
		'StoryDefaults'
	];

	angular.module('community.stories')
		.controller('StoryDetail', StoryDetailController);

}(window._));
