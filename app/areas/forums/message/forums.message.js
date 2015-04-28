(function(_){
	'use strict';

	var forumMessageController = function($scope, messageThreadFilter, breadcrumbService){
		var ctrl = this;

		function setThreadData(dataResult) {
			ctrl.originalMessage = dataResult[0];
			ctrl.messageThread = dataResult;
			ctrl.allMessageCount = _.findWhere(ctrl.originalMessage.stats, { key: 'comments' }).value + 1;
			
			breadcrumbService.setCurrentBreadcrumb(ctrl.originalMessage.subject);
		}
		messageThreadFilter.set({ onFilter: setThreadData });

		function clearMessageReplyText(){
			ctrl.messageReplyText = null;
		}

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		_.extend(ctrl, {
			currentReply: null,
			messageReplyText: null,
			messageThreadFilter: messageThreadFilter,
			messageIsBeingRepliedTo: function(messageId){
				return messageId === this.currentReply
			},
			showReply: function(messageId){
				clearMessageReplyText();
				this.currentReply = messageId;
			},
			cancelReply: function(){
				this.currentReply = null;
			},
			submitReply: function(){
				clearMessageReplyText();
				this.currentReply = null;
			}
		})

	};
	forumMessageController.$inject = ['$scope', 'MessageThreadFilter', 'CommunityBreadcrumbService'];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
