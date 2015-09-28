(function(_){
	'use strict';

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
			commentFilter: featuresCommentFilter
		});

		breadcrumbService.setCurrentBreadcrumb(featureRequest.subject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	}
	featuresDetailController.$inject = ['$scope', 'CommunityBreadcrumbService', 'CommunityNodeService', 'FeaturesCommentFilter', 'FeaturesDataService', 'FeaturesDetail'];

	angular.module('community.features')
		.controller('FeaturesDetail', featuresDetailController);

}(window._));
