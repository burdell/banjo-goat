(function(_){
	'use strict';

	function AnnouncementListController ($scope, $state, announcementDetail, communityApi, breadcrumbService, filterService){
		var ctrl = this;
		_.extend(ctrl, {
			showCommentForm: false,
			currentAnnouncement: announcementDetail.originalMessage,
			currentComments: announcementDetail.comments,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Announcements.comments, 
				filterArguments: [ announcementDetail.originalMessage.id ],
				persistFilterModel: false,
				setInitialData: false
			})
		});
		
		breadcrumbService.setCurrentBreadcrumb(ctrl.currentAnnouncement.subject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	}
	AnnouncementListController.$inject = ['$scope', '$state', 'AnnouncementDetail', 'CommunityApiService', 'CommunityBreadcrumbService', 'CommunityFilterService'];

	angular.module('community.announcements')
		.controller('AnnouncementDetail', AnnouncementListController);

}(window._));
