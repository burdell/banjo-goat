(function(_){
	'use strict';
	
	function storyDisplay() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(timelineService) {
			var ctrl = this;

			_.extend(ctrl, {
				goToStory: function(){
					
				}
			})
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'stories/list/storydisplay.html',
	        controllerAs: 'storydisplay',
	        bindToController: true,
	        replace: true,
	        restrict: 'E',
	        scope: {
	        	story: '=',

	        }
	    };

	    return directive;
	}

	angular.module('community.stories')
		.directive('storyDisplay', storyDisplay);
		
}(window._));