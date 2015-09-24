(function(_){
	'use strict';

	function AnnouncementListController ($scope, $state, announcementDetail, communityApi, breadcrumbService, filterService){
		var ctrl = this;
		_.extend(ctrl, {
			currentAnnouncement: announcementDetail.originalMessage,
			currentComments: announcementDetail.comments,
			replyInProgress: false,
			showReply: function(){
				ctrl.replyInProgress = true;
			},
			cancelReply: function(){
				ctrl.replyInProgress = false;
			},
			submitReply: function(){
				if (ctrl.comment.replyText) {
					communityApi.Core.message({ 
						body: ctrl.comment.replyText,
						nodeId: ctrl.currentAnnouncement.node.id,
						topicId: ctrl.currentAnnouncement.id
					}).then(function(result){
						debugger;
					})
				}
			},
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
