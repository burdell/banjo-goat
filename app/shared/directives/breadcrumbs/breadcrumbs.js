(function(_){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(breadcrumbService) {
			var currentBreadcrumb = null;
			var breadcrumbList = null;

			breadcrumbService.getBreadcrumbData().then(function(breadcrumbData) {
				currentBreadcrumb = breadcrumbData.currentBreadcrumb;
				breadcrumbList = breadcrumbData.breadcrumbList;
			});

			var ctrl = this;
			_.extend(ctrl, {
				currentBreadcrumb: function(){
					if (currentBreadcrumb) {
						return currentBreadcrumb.name;
					}
				},
				breadcrumbList: function(){
					return breadcrumbList;
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