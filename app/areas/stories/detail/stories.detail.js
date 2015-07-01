(function(_){
	'use strict';

	function StoryDetailController ($scope, communityApi, breadcrumbService, filterService, storyThread, storyDefaults){
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
			})
		});

		var cover = _.where(this.story.mediaList, { isCover: true });
		if (!cover || cover.length === 0) {
			cover = {
				imageUrl: storyDefaults.coverPhoto
			}
		}
		ctrl.cover = cover;

		breadcrumbService.setCurrentBreadcrumb(this.story.subject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	}
	StoryDetailController.$inject = [
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
