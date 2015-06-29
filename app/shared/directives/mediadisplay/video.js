(function(_){
	'use strict';
	
	function videoEmbed() {
		var link = function(scope, element, attrs) {
			var videoElementId = 'community-video-' + scope.$id;
			element.attr('id', videoElementId);
			
			 var player = new YT.Player(videoElementId, {
                videoId: scope.videoembed.videoId,
                origin: 'http://localhost:4200/'
            });

		};

		var controller = function() {
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'videoembed',
	        bindToController: true,
	        restrict: 'A',
	        scope: {
	        	videoId: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityVideoEmbed', videoEmbed);
		
}(window._));