(function(_){
	'use strict';

	function communityMessage() {
		function link(scope, element, attrs) {
		    
		}

		function controller() {	
			var ctrl = this;

			_.extend(ctrl, {
				hideVoteButtons: this.hideVoteButtons
			});
		}
		controller.$inject = [];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/message/message.html',
	        restrict: 'E',
	        controllerAs: 'messageDisplay',
	        bindToController: true,
	        replace: true,
	        scope: {
	        	hideVoteButtons: '=',
	        	message: '=',
	        	replyClickFn: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityMessage', communityMessage);
}(window._));