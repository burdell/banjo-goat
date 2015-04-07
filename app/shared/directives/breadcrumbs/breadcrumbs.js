(function(){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(nodeService) {
			function GetBreadcrumbList(currentNode) {
				var breadCrumbList = [];

				var parentNode = currentNode.parent;
				while(parentNode) {
					breadCrumbList.unshift(parentNode);
					parentNode = parentNode.parent;
				}

				return breadCrumbList;
			}

			var breadcrumbList = GetBreadcrumbList(nodeService.CurrentNode);

			var ctrl = this;
			_.extend(ctrl, {
				currentNode: nodeService.CurrentNode,
				breadcrumbList: breadcrumbList
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
		
}());