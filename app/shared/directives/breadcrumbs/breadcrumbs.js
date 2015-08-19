(function(_){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(breadcrumbService, routingService) {
			breadcrumbService.getBreadcrumbData(this.nodeId, true);

			var ctrl = this;
			_.extend(ctrl, {
				currentBreadcrumb: function(){
					var currentBreadcrumb = breadcrumbService.CurrentBreadcrumb;
					return currentBreadcrumb && currentBreadcrumb.name;
				},
				breadcrumbList: function(){
					return breadcrumbService.breadcrumbList;
				},
				target: function(targetedHref) {
					return (routingService.getArea(targetedHref) !== routingService.getCurrentArea()) ? '_self' : '';
				}
			});
		};
		controller.$inject = ['CommunityBreadcrumbService', 'CommunityRoutingService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/breadcrumbs/breadcrumbs.html',
	        controllerAs: 'breadcrumbs',
	        bindToController: true,
	        replace: true,
	        restrict: 'E',
	        scope: {
	        	nodeId: '@'
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityBreadcrumbs', communityBreadcrumbs);
		
}(window._));