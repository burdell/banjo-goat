(function(){
	'use strict';

	function imageError($timeout) {
		function link(scope, element, attrs) {
			var $element = $(element);

		    $timeout(function(){
		    	$element.find('img').error(function(){
		    		this.classList.add('missingImage');
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