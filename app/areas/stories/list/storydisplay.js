(function(_){
	'use strict';
	
	function storyDisplay() {
		var link = function(scope, element, attrs) {
		};

		var controller = function() {
			var ctrl = this;
			
			var media = _.find(ctrl.storyMedia, function(mediaObject){ 
				return mediaObject.meta && mediaObject.meta.isCover && mediaObject.meta.isCover.value === 'true' 
			});
		
			if (media) {
				ctrl.coverphoto = media.url;
			}

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
	        	storyMedia: '=',
	        	defaultPhotoUrl: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.stories')
		.directive('storyDisplay', storyDisplay);
		
}(window._));