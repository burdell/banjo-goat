
'use strict';

require('services/breadcrumb.js');
require('services/routing.js');
require('services/nodestructure.js');

require('directives/sticky/sticky.js');
require('directives/pulse/pulse.js');


var _ = require('underscore');

var directoryController = function($scope, breadcrumbService, localizationService, routingService, nodeService){
	var ctrl = this;

	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});
	breadcrumbService.setCurrentBreadcrumb(localizationService.data.directives.mainnavbar.directory);
	
	var discussionTypes = nodeService.DiscussionTypes;		
	var directoryList = nodeService.getProductTypeList();

	var discussionNodeOrder = ['Alpha', 'Beta', 'Public', 'stories', 'qa', 'announcements', 'features', 'bugs'];

	var mainSectionExclude  = [];
	_.extend(ctrl, {
		directoryList: directoryList,
		landingPages: routingService.landingPages(),
		getDiscussionHref: function(node){
			return routingService.generateUrl(node.discussionStyle + '.list', { nodeId: node.urlCode })
		},
		discussionNodeOrder: function(discussion){
			var discussionType = discussion.discussionStyle === 'forums' ? discussion.name : discussion.discussionStyle;
			return _.indexOf(discussionNodeOrder, discussionType);

		},
		manualExclude: function(node) {
			return _.indexOf(mainSectionExclude, node.id) < 0;
		}
	});
};
directoryController.$inject = ['$scope', 'CommunityBreadcrumbService', 'CommunityLocalizationService', 'CommunityRoutingService', 'NodeService'];

angular.module('community.directory')
	.controller('Directory', directoryController);


