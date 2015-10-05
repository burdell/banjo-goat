(function(_){
	'use strict';
	
	function storyDisplay() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(communityDefaults) {
			var ctrl = this;
			
			var media = _.find(ctrl.storyMedia, function(mediaObject){ 
				return mediaObject.meta && mediaObject.meta.isCover && mediaObject.meta.isCover.value === 'true' 
			});
		
			if (media) {
				ctrl.coverphoto = media.url;
			}

			_.extend(ctrl, {
				defaultPhotoUrl: communityDefaults.noPhoto
			});
		};
		controller.$inject = ['communityDefaults'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/storydisplay/storydisplay.html',
	        controllerAs: 'storydisplay',
	        bindToController: true,
	        replace: true,
	        restrict: 'E',
	        scope: {
	        	story: '=',
	        	storyMedia: '=',
	        	hideSummary: '=',
	        	hideAuthor: '=',
	        	fillWidth: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('storyDisplay', storyDisplay);
		
}(window._));