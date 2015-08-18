(function(_){
	'use strict';

	function featuresDetailController ($scope, breadcrumbService, nodeServiceWrapper, featuresCommentFilter, featuresData, featuresDetail){
		var ctrl = this;
		var featureRequest = featuresDetail.model;

		function setCommentData (result){
			ctrl.commentList = result.collection;
			ctrl.commentCount = result.next.total;
		}
		featuresCommentFilter.set({ onFilter: setCommentData });

		nodeServiceWrapper.get().then(function(nodeService) {
			var productNode = nodeService.getNode(featureRequest.productId);
			ctrl.productName = productNode.name;
		});

		var statusTypes = featuresData.StatusTypes;
		_.extend(ctrl, {
			getStatusText: function(statusType){
				return statusTypes[statusType].display;
			},
			getMetaValue: function(key) {
				return featureRequest.meta[key].value;
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
