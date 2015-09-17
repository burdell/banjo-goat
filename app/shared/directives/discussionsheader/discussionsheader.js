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
	        bindToController: true,
	        templateUrl: 'directives/discussionsheader/discussionsheader.html',
	        restrict: 'E',
	        replace: true,
	        scope: {
	        	headerText: '@'
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('discussionsHeader', discussionsHeader);
}());