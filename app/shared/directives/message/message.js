
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

		var perPage = null;

		if (ctrl.threadFilter) {
			ctrl.threadFilter.model('per_page');
		}

		_.extend(ctrl, {
			hideVoteButtons: this.hideVoteButtons,
			getMessagePosition: function(localIndex) {
				var currentPage = ctrl.threadFilter.model('page') || 1;
				var total = ctrl.threadFilter.metaData('totalElements');
				
				var messageIndex = ((perPage * (currentPage - 1)) + ctrl.localIndex) + 1;
				return  messageIndex + " of " + total;
			}
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
	        	upvoteOnly: '=',
	        	threadFilter: '=',
	        	localIndex: '='
	        }
	    };

    return directive;
}

angular.module('community.directives')
	.directive('communityMessage', communityMessage);
