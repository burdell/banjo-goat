
'use strict';

require('services/breadcrumb.js');
require('services/routing.js');
require('services/nodestructure.js');

var _ = require('underscore');

var directoryController = function($scope, breadcrumbService, routingService, nodeService){
	var ctrl = this;

	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});
	breadcrumbService.setCurrentBreadcrumb('Directory');
	
	var discussionTypes = nodeService.DiscussionTypes;		
	var directoryList = [
		{ header: 'Community', list: discussionTypes.general },
		{ header: 'Broadband', list: discussionTypes.broadband },
		{ header: 'Enterprise', list: discussionTypes.enterprise }
	];

	var discussionNodeOrder = ['Alpha', 'Beta', 'Public', 'stories', 'qa', 'announcements', 'features', 'bugs'];

	var mainSectionExclude  = [43, 83];

	_.extend(ctrl, {
		directoryList: directoryList,
		landingPages: routingService.landingPages(),
		getDiscussionHref: function(node){
			return routingService.generateUrl(node.discussionStyle + '.list', { nodeId: node.urlCode })
		},
		discussionNodeOrder: function(discussion){
			var discussionType = discussion.discussionType === 'forums' ? discussion.name : discussion.discussionType;
			return _.indexOf(discussionNodeOrder, discussionType);

		},
		manualExclude: function(node) {
			return _.indexOf(mainSectionExclude, node.id) < 0;
		}
	});
};
directoryController.$inject = ['$scope', 'CommunityBreadcrumbService', 'CommunityRoutingService', 'NodeService'];

angular.module('community.directory')
	.controller('Directory', directoryController);


