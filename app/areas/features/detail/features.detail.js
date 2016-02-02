
'use strict';

require('filters/sanitize.js');

require('directives/username/username.js');
require('directives/useravatar/useravatar.js');
require('directives/showcount/showcount.js');

require('directives/message/message.js');
require('directives/pager/pager.js');
require('directives/commentform/commentform.js');

var _ = require('underscore');

function featuresDetailController ($scope, $timeout, breadcrumbService, nodeServiceWrapper, scrollService, permissionsService, routingService, featuresCommentFilter, featuresData, featuresDetail){
	var ctrl = this;
	var featureRequest = featuresDetail;

	ctrl.replyMessage = {
		id: null,
		topicId: featureRequest.id,
		node: featureRequest.node,
		parentId: featureRequest.id
	};
	
	function setCommentData (result){
		ctrl.commentList = result.content;
		if (result.first) {
			ctrl.commentList.shift();
		}
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
			return statusTypes[featureRequest.state].code;
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
			scrollService.scroll('featureReply');
		},
		replyPosted: function(result){
			featuresCommentFilter.filter({ page: ctrl.numberOfPages });
			scrollService.scroll(result.id);
		},
		messageIsBeingRepliedTo: function(messageId){
			return messageId === this.currentReply;
		},
		showReply: function(message){
			ctrl.showFeatureReply();

			$timeout(function(){
				ctrl.replyMessage.parentId = message.id;
				$scope.$broadcast('texteditor:addQuote', message);
			}, 0);
		},
		isEdited: featureRequest.message.editDate && (featureRequest.message.postDate != featureRequest.message.editDate)
	});

	breadcrumbService.setCurrentBreadcrumb(featureRequest.subject);
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});
}
featuresDetailController.$inject = [
	'$scope', 
	'$timeout',
	require('services/breadcrumb.js'), 
	require('services/nodestructure.js'), 
	require('services/scroll.js'),
	require('services/permissions.js'),
	require('services/routing.js'),
	'FeaturesCommentFilter', 
	'FeaturesDataService', 
	'FeaturesDetail'
];

angular.module('community.features')
	.controller('FeaturesDetail', featuresDetailController);


