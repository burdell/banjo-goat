(function(_){
	'use strict';
	
	function storyDisplay() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(communityDefaults, routingService) {
			var ctrl = this;
			
			var media = _.find(ctrl.storyMedia, function(mediaObject){ 
				return mediaObject.meta && mediaObject.meta.isCover && mediaObject.meta.isCover.value === 'true' 
			});
		
			if (media) {
				ctrl.coverphoto = media.url;
			}

			_.extend(ctrl, {
				defaultPhotoUrl: communityDefaults.noPhoto,
				storyUrl: routingService.generateUrl('stories.detail', { storyId: ctrl.story.id, nodeId: ctrl.story.node.urlCode })
			});
		};
		controller.$inject = ['communityDefaults', 'CommunityRoutingService'];

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