(function(_){
	'use strict';
	
	function videoEmbed() {
		var link = function(scope, element, attrs) {
			var videoElementId = 'community-video-' + scope.$id;
			element.attr('id', videoElementId);
			
			var videoSource = scope.videoembed.videoSource;
			if (videoSource === 'youtube') {
				var player = new YT.Player(videoElementId, {
	                videoId: scope.videoembed.videoId,
	                origin: 'http://localhost:4200/'
	            });
			} else if (videoSource === 'vimeo') {
				var $element = $(element);
				$element.append('<iframe src="//player.vimeo.com/video/' + scope.videoembed.videoId +'" frameborder="0" width="615.5" height="365" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
			}
			 
		};

		var controller = function() {
		};
		controller.$inject = [];

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
	        	videoSource: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityVideoEmbed', videoEmbed);
		
}(window._));