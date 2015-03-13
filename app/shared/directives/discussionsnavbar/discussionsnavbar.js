(function(){
	'use strict';

	function discussionsNavBar() {
		function link(scope, element, attrs) {
		    
		}

	    var directive = {
	        link: link,
	        templateUrl: 'directives/discussionsnavbar/discussionsnavbar.html',
	        restrict: 'EA',
	        replace: true,
	        scope: true
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('discussionsNavBar', discussionsNavBar);
}());