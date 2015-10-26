
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

function AnnouncementDetailController ($scope, $state, announcementDetail, communityApi, breadcrumbService, filterService){
		var ctrl = this;

		var originalMessage = announcementDetail.content.shift();

		console.log(originalMessage);

		_.extend(ctrl, {
			showCommentForm: false,
			currentAnnouncement: originalMessage,
			currentComments: announcementDetail,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Announcements.comments, 
				filterArguments: [ originalMessage.id ],
				persistFilterModel: false,
				setInitialData: false
			})
		});
		
		breadcrumbService.setCurrentBreadcrumb(ctrl.currentAnnouncement.subject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	}
	AnnouncementDetailController.$inject = ['$scope', '$state', 'AnnouncementDetail', 'CommunityApiService', 'CommunityBreadcrumbService', 'CommunityFilterService'];

angular.module('community.announcements')
	.controller('AnnouncementDetail', AnnouncementDetailController);


