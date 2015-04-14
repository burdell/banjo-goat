(function(_){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(nodeService) {
			function getBreadcrumbList() {
				var breadCrumbList = [];
				var currentNode = nodeService.CurrentNode;

				var parentNode = currentNode.parent;
				while(parentNode) {
					breadCrumbList.unshift(parentNode);
					parentNode = parentNode.parent;
				}

				return breadCrumbList;
			}

			function currentNode() {
				return nodeService.CurrentNode.name;
			}

			var ctrl = this;
			_.extend(ctrl, {
				currentNode: currentNode,
				breadcrumbListFn: getBreadcrumbList
			});
		};
		controller.$inject = ['CommunityNodeService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/breadcrumbs/breadcrumbs.html',
	        controllerAs: 'breadcrumbs',
	        bindToController: true,
	        replace: true,
	        restrict: 'E',
	        scope: {}
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityBreadcrumbs', communityBreadcrumbs);
		
}(window._));