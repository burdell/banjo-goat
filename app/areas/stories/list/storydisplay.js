(function(_){
	'use strict';
	
	function storyDisplay() {
		var link = function(scope, element, attrs) {
		};

		var controller = function() {
			var ctrl = this;
			
			_.extend(ctrl, {
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
	        	defaultPhotoUrl: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.stories')
		.directive('storyDisplay', storyDisplay);
		
}(window._));