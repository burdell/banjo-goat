(function(){
	'use strict';

	function imageError($timeout) {
		function link(scope, element, attrs) {
			var $element = $(element);

		    $timeout(function(){
		    	$element.find('img').error(function(){
		    		this.src = 'https://slack-files.com/files-tmb/T027XH0QK-F079YFZQT-b90fead886/no_pic_720.png';
		    		this.classList.add('cmuImageMissing');
		    	});

		    }, 0);

		    scope.$on('$destroy', function(){
		    	$element.unbind();
		    });
		}

	    var directive = {
	        link: link,
	        restrict: 'A',
	        scope: true
	    };

	    return directive;
	}
	imageError.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('handleImageError', imageError);
}());