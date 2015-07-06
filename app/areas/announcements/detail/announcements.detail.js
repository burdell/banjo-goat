(function(_){
	'use strict';

	function AnnouncementListController ($state, announcementDetail, communityApi, filterService){
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
			commentData: announcementDetail.nextCommentMetaData,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Forums.comments, 
				filterArguments: [ announcementDetail.originalMessage.id ],
				persistFilterModel: false,
				setInitialData: false
			})
		});
	}
	AnnouncementListController.$inject = ['$state', 'AnnouncementDetail', 'CommunityApiService', 'CommunityFilterService'];

	angular.module('community.announcements')
		.controller('AnnouncementDetail', AnnouncementListController);

}(window._));
