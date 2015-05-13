(function(_){
	'use strict';

	function communityAnnouncement() {
		function link(scope, element, attrs) {
		    
		}

		function controller(nodeService) {
		
		}
		controller.$inject = [];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/announcement/announcement.html',
	        restrict: 'E',
	        controllerAs: 'announcement',
	        bindToController: true,
	        replace: true,
	        scope: {}
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityAnnouncement', communityAnnouncement);

}(window._));