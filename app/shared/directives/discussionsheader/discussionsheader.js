(function(){
	'use strict';

	function discussionsHeader() {
		function link(scope, element, attrs) {
		    
		}

	    var directive = {
	        link: link,
	        templateUrl: 'directives/discussionsheader/discussionsheader.html',
	        restrict: 'E',
	        replace: true,
	        scope: true
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('discussionsHeader', discussionsHeader);
}());