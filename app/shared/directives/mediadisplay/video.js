(function(_){
	'use strict';
	
	function videoEmbed() {
		var link = function(scope, element, attrs) {
			var videoElementId = 'community-video-' + scope.$id;
			element.attr('id', videoElementId);
			
			var videoType = scope.videoembed.videoType;
			if (videoType === 'video:youtube') {
				var player = new YT.Player(videoElementId, {
	                videoId: scope.videoembed.videoId
	            });
			} else if (videoType === 'video:vimeo') {
				var $element = $(element);
				$element.append('<iframe src="//player.vimeo.com/video/' + scope.videoembed.videoId +'" frameborder="0" width="615.5" height="365" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
			}
			 
		};

		var controller = function($location) {
		};
		controller.$inject = ['$location'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'videoembed',
	        template: '<div></div>',
	        replace: true,
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	videoId: '=',
	        	videoType: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityVideoEmbed', videoEmbed);
		
}(window._));