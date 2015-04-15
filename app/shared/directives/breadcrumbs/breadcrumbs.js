(function(_){
	'use strict';
	
	function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(breadcrumbService) {
			function currentBreadcrumb() {
				return breadcrumbService.getCurrentBreadcrumb().name;
			}

			function breadcrumbListFn(){
				return breadcrumbService.getBreadcrumbList();
			}

			var ctrl = this;
			_.extend(ctrl, {
				currentBreadcrumb: currentBreadcrumb,
				breadcrumbListFn: breadcrumbListFn
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