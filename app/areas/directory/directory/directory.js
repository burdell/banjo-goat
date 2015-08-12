(function(_){
	'use strict';

	var directoryController = function(routingService, nodeService){
		var ctrl = this;
		
		var discussionTypes = nodeService.DiscussionTypes;		
		var directoryList = [
			{ header: 'Community', list: discussionTypes.general },
			{ header: 'Broadband', list: discussionTypes.broadband },
			{ header: 'Enterprise', list: discussionTypes.enterprise }
		];

		var discussionNodeOrder = ['Alpha', 'Beta', 'General', 'stories', 'qa', 'announcements', 'features', 'bugs'];

		var mainSectionExclude  = [43, 83];

		_.extend(ctrl, {
			directoryList: directoryList,
			landingPages: routingService.landingPages(),
			getDiscussionHref: function(node){
				return routingService.generateUrl(node.discussionType + '.list', { nodeId: node.urlCode })
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
	directoryController.$inject = ['CommunityRoutingService', 'NodeService'];

	angular.module('community.directory')
		.controller('Directory', directoryController);

}(window._));
