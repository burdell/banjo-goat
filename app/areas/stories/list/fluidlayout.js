(function(_){
	'use strict';

	function communityFluidLayout($timeout) {
		function link(scope, element, attrs) {
			$timeout(function(){
				var msnry = new Masonry(element[0], {
					itemSelector: '.community-story',
					columnWidth: 100
				});
			}, 0);
		}

		function controller() {	
		}
		controller.$inject = [];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        restrict: 'A',
	        controllerAs: 'fluidlayout',
	        bindToController: true,
	        scope: true	        
	    };

	    return directive;
	}
	communityFluidLayout.$inject = ['$timeout'];

	angular.module('community.stories')
		.directive('communityFluidLayout', communityFluidLayout);
}(window._));