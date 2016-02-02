
'use strict';

require('directives/message/message.js');
require('directives/commentlist/commentlist.js');
require('directives/arealinkhandler/arealinkhandler.js');
require('directives/commentform/commentform.js');

require('filters/unescape.js');

var _ = require('underscore');

function AnnouncementDetailController ($scope, $state, announcementDetail, communityApi, breadcrumbService, filterService, permissionsService, routingService, nodeServiceWrapper){
		var ctrl = this;

		var originalMessage = announcementDetail.content.shift();

		ctrl.editUrl = routingService.generateUrl(routingService.getCurrentArea() + '.edit', { 
			nodeId: $state.params.nodeId, 
			id: originalMessage.id,
			messageType: 'topic'
		});

		nodeServiceWrapper.get().then(function(nodeService){
			var parentNode = nodeService.getNode(originalMessage.node.parentId);
			ctrl.productName = parentNode.name;
		});

		_.extend(ctrl, {
			showCommentForm: false,
			currentAnnouncement: originalMessage,
			currentComments: announcementDetail,
			moreCommentsFilter: filterService.getNewFilter({ 
				filterFn: communityApi.Announcements.comments, 
				filterArguments: [ originalMessage.id ],
				persistFilterModel: false,
				setInitialData: false
			}),
			isEdited: originalMessage.editDate && (originalMessage.postDate != originalMessage.editDate)
		});
		
		breadcrumbService.setCurrentBreadcrumb(originalMessage.context.topicSubject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	}
	AnnouncementDetailController.$inject = [
		'$scope', 
		'$state', 
		'AnnouncementDetail', 
		require('services/api.js'), 
		require('services/breadcrumb.js'), 
		require('services/filter.js'),
		require('services/permissions.js'),
		require('services/routing.js'),
		require('services/nodestructure.js')
	];

angular.module('community.announcements')
	.controller('AnnouncementDetail', AnnouncementDetailController);


