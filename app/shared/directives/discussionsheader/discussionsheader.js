(function(){
	'use strict';

	function discussionsHeader() {
		function controller(nodeService) {
		    var ctrl = this;
		    
		    nodeService.get().then(function(nodeData) {
		    	ctrl.currentNode = nodeData.CurrentNode;
		    });
		}
		controller.$inject = ['CommunityNodeService'];

	    var directive = {
	        controller: controller,
	        controllerAs: 'discussionsheader',
	        templateUrl: 'directives/discussionsheader/discussionsheader.html',
	        restrict: 'E',
	        replace: true,
	        scope: true
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('discussionsHeader', discussionsHeader);
}());