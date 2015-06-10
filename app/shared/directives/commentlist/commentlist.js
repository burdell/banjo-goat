(function(_){
	'use strict';

	function communityCommentList() {
		function link(scope, element, attrs) {
		    
		}

		function controller() {	
			var ctrl = this;
			

			_.extend(ctrl, {
			});
		}
		controller.$inject = [];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/commentlist/commentlist.html',
	        restrict: 'E',
	        controllerAs: 'commentlist',
	        bindToController: true,
	        replace: true,
	        scope: {
	        	currentComments: '=',
	        	commentData: '=commentMetadata',
	        	commentFilter: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityCommentList', communityCommentList);
}(window._));