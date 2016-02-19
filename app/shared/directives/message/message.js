
'use strict';

require('filters/sanitize.js');
require('filters/timefromnow.js');

require('directives/sorter/sorter.js');
require('directives/userbadge/userbadge.js');
require('directives/sticky/sticky.js');

require('services/permissions.js');

var _ = require('underscore');

function communityMessage() {
	function controller($anchorScroll, $location, $timeout, $stateParams, localizationService, permissionsService, routingService, scrollService) {	
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

		var currentArea = routingService.getCurrentArea();
		var messageType = ctrl.message.id === ctrl.message.topicId ? 'topic' : 'comment';
		ctrl.editUrl = routingService.generateUrl(currentArea + '.edit', { 
			nodeId: $stateParams.nodeId, 
			id: ctrl.message.id,
			messageType: messageType
		});

		var strings = localizationService.data.directives.message;
		_.extend(ctrl, {
			hideVoteButtons: this.hideVoteButtons,
			getMessagePosition: function() {
				var currentPage = ctrl.threadFilter.model('page') || 1;
				var total = ctrl.threadFilter.metaData('totalElements');				
				var messageIndex = ((perPage * (currentPage - 1)) + ctrl.localIndex) + 1;
				return  messageIndex + " " + strings.of + " " + total;
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
			messageStats: ctrl.message.scores,
			isEdited: ctrl.message.editDate && (ctrl.message.postDate != ctrl.message.editDate),
			setMessageUrl: function(){
				if (!ctrl.messageUrl) {
					var originalMessageId = ctrl.originalMessage.id;
					var specificMessageId = ctrl.message.id;

					var detailId = routingService.getDetailId(currentArea);
					var routeData = {
						nodeId: ctrl.message.node.urlCode
					};
					routeData[detailId] = ctrl.originalMessage.id;

					var hash = null;
					if (originalMessageId !== specificMessageId) {
						hash = specificMessageId;
					}

					var baseUrl = $location.protocol() + '://' + location.host;
					ctrl.messageUrl = baseUrl + routingService.generateUrl(currentArea + '.detail', routeData, hash);
				}
			}
		});
		}
		controller.$inject = [
			'$anchorScroll', 
			'$location', 
			'$timeout', 
			'$stateParams',
			"CommunityLocalizationService",
			'CommunityPermissionsService', 
			require('services/routing.js'), 
			require('services/scroll.js')
		];
	    
	    var directive = {
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
	            replyShown: "=",
	        	localIndex: '='
	        }
	    };

    return directive;
}

angular.module('community.directives')
	.directive('communityMessage', communityMessage);
