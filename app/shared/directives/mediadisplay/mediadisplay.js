(function(_){
	'use strict';
	  
	function mediaDisplay() {
		var link = function(scope, element, attrs) {

		};

		var controller = function(mediaService) {
			var ctrl = this;

			_.extend(ctrl, {
			});
		};
		controller.$inject = ['CommunityMedaiService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'mediadisplay',
	        templateUrl: 'directives/mediadisplay/mediadisplay.html',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityMediaDisplay', mediaDisplay);
		
}(window._));
