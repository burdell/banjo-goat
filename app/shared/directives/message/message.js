
'use strict';

require('filters/sanitize.js');
require('filters/timefromnow.js');

require('directives/userbadge/userbadge.js');

var _ = require('underscore');

function communityMessage() {
	function link(scope, element, attrs) {
	    
	}

	function controller($anchorScroll, $location, $timeout, scrollService) {	
		var ctrl = this;
		
		var perPage = null;

		if (ctrl.threadFilter) {
			perPage = ctrl.threadFilter.model('per_page');
		}

		var linkedMessage = $location.hash();
		if (linkedMessage && Number(linkedMessage) === ctrl.message.id) {
			scrollService.scroll();
		}

		var reply = null;
		if (ctrl.message.parentId !== ctrl.message.topicId) {
			reply = { 
				parentId: ctrl.message.parentId,
				username: ctrl.message.context.parentAuthor.login
			};	
		}

		_.extend(ctrl, {
			hideVoteButtons: this.hideVoteButtons,
			getMessagePosition: function() {
				var currentPage = ctrl.threadFilter.model('page') || 1;
				var total = ctrl.threadFilter.metaData('totalElements');				
				var messageIndex = ((perPage * (currentPage - 1)) + ctrl.localIndex) + 1;
				return  messageIndex + " of " + total;
			},
			goToParentMessage: function(parentId) {
				$location.hash(parentId);

				var shownIds = ctrl.threadFilter.metaData('idList');
				if (_.indexOf(shownIds, Number(parentId)) < 0) {
					ctrl.threadFilter
						.set({ targetCommentHash: true });
				} else {
					scrollService.scroll();
				}
			},
			reply: reply,
			messageStats: ctrl.message.scores
		});
		}
		controller.$inject = ['$anchorScroll', '$location', '$timeout', require('services/scroll.js')];
	    
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
