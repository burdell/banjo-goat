(function(_){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(breadcrumbService) {
			breadcrumbService.getBreadcrumbData();

			var ctrl = this;
			_.extend(ctrl, {
				currentBreadcrumb: function(){
					var currentBreadcrumb = breadcrumbService.CurrentBreadcrumb;
					return currentBreadcrumb && currentBreadcrumb.name;
				},
				breadcrumbList: function(){
					return breadcrumbService.breadcrumbList;
				}
			});
		};
		controller.$inject = ['CommunityBreadcrumbService'];

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