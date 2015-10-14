
'use strict';

require('services/filter.js');
require('services/api.js');
require('services/breadcrumb.js');

require('directives/message/message.js');
require('directives/commentlist/commentlist.js');
require('directives/arealinkhandler/arealinkhandler.js');
require('directives/commentform/commentform.js');

require('filters/unescape.js');

var _ = require('underscore');
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


