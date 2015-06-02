(function(_){
	'use strict';

	function StoryDetailController ($scope, communityApi, breadcrumbService, filterService, storyThread){
		var ctrl = this;

		_.extend(ctrl, {
			story: storyThread.originalMessage,
			comments: storyThread.comments,
			commentData: storyThread.nextCommentMetaData,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Forums.comments, 
				filterArguments: [ storyThread.originalMessage.id ],
				persistFilterModel: false,
				setInitialData: false
			})
		});

		breadcrumbService.setCurrentBreadcrumb(this.story.subject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	}
	StoryDetailController.$inject = ['$scope', 'CommunityApiService', 'CommunityBreadcrumbService',  'CommunityFilterService', 'StoryThread'];

	angular.module('community.stories')
		.controller('StoryDetail', StoryDetailController);

}(window._));
