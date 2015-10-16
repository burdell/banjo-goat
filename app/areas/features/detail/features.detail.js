
'use strict';

require('services/breadcrumb.js');
require('services/nodestructure.js');

require('filters/sanitize.js');

require('directives/message/message.js');
require('directives/pager/pager.js');
require('directives/commentform/commentform.js');

var _ = require('underscore');

function featuresDetailController ($scope, breadcrumbService, nodeServiceWrapper, featuresCommentFilter, featuresData, featuresDetail){
	var ctrl = this;
	var featureRequest = featuresDetail;
	
	function setCommentData (result){
		ctrl.commentList = result.content;
		ctrl.numberOfPages = result.totalPages;
	}
	featuresCommentFilter.set({ onFilter: setCommentData });

	nodeServiceWrapper.get().then(function(nodeService) {
		var productNode = nodeService.getNode(featureRequest.message.node.parentId);
		ctrl.productName = productNode.name;
	});


	var statusTypes = featuresData.StatusTypes;
	_.extend(ctrl, {
		currentReply: null,
		getStatusCode: function(feature){
			return statusTypes[feature.state].code;
		},
		getStatusText: function(feature){
			return statusTypes[feature.state].display;
		},
		getMetaValue: function(key) {
			var metaObject = featureRequest.meta[key];
			return metaObject && metaObject.value;
		},
		originalMessage: featureRequest,
		commentFilter: featuresCommentFilter,
		showFeatureReply: function(){
			ctrl.featureReplyShown = true;
		},
		replyPosted: function(result){
			if (ctrl.numberOfPages > 1) {
				featuresCommentFilter.filter({ page: ctrl.numberOfPages });
			} else {
				ctrl.commentList.push(result);
			}
		},
		showReply: function(messageId){
			ctrl.currentReply = messageId;
		},
		messageIsBeingRepliedTo: function(messageId){
			return messageId === this.currentReply;
		},
		showReply: function(messageId){
			ctrl.currentReply = messageId;
		}
	});

	breadcrumbService.setCurrentBreadcrumb(featureRequest.subject);
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});
}
featuresDetailController.$inject = ['$scope', 'CommunityBreadcrumbService', 'CommunityNodeService', 'FeaturesCommentFilter', 'FeaturesDataService', 'FeaturesDetail'];

angular.module('community.features')
	.controller('FeaturesDetail', featuresDetailController);


