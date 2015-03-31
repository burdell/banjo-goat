(function(){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(nodeService) {
			this.currentNode = nodeService.CurrentNode;
			this.breadcrumbList = this.getBreadcrumbList(this.currentNode);
		};

		controller.prototype.getBreadcrumbList = function(currentNode){
			var breadCrumbList = [];

			var parentNode = currentNode.parent;
			while(parentNode) {
				breadCrumbList.unshift(parentNode);
				parentNode = parentNode.parent;
			}

			return breadCrumbList;
		};

		controller.$inject = ['CommunityNodeService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/breadcrumbs/breadcrumbs.html',
	        controllerAs: 'breadcrumbs',
	        bindToController: true,
	        restrict: 'AE',
	        scope: true
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communityBreadcrumbs', communityBreadcrumbs);
		
}());