(function(_){
	'use strict';

	function gridList($timeout) {
		function link(scope, element, attrs) {
			var $element = $(element);

			function init(reload, options) {
				$timeout(function(){
					if (reload) {
						$element.masonry('reloadItems');
					}
					
					var grid = $element.masonry(options);
					grid.imagesLoaded().progress(function(){
						grid.masonry('layout');
					});
				});
			}
			init(false, {
				itemSelector: '.cmuStoryItem',
				gutter: 14,
				animationDuration: 0
			});

			scope.$on('communityGridList:redraw', function(){
				init(true);
			});
		}

		function controller() {	
			
		}
		controller.$inject = ['$compile', '$scope'];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        restrict: 'A',
	        controllerAs: 'fluidlayout',
	        bindToController: true,
	        scope: {
	        	tileTemplate: '=',
	        	tileList: '='
	        }	        
	    };

	    return directive;
	}
	gridList.$inject = ['$timeout'];

	angular.module('community.stories')
		.directive('communityGridList', gridList);
}(window._));