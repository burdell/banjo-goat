
'use strict';

require('filters/sanitize.js');
require('filters/timefromnow.js');

require('directives/userbadge/userbadge.js');

var _ = require('underscore');

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
	        	replyClickFn: '=',
	        	originalMessage: '=',
	        	showOp: '=',
	        	upvoteOnly: '='
	        }
	    };

    return directive;
}

angular.module('community.directives')
	.directive('communityMessage', communityMessage);
