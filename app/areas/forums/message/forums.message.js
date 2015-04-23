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

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		_.extend(ctrl, {
			currentReply: null,
			messageIsBeingRepliedTo: function(messageId){
				return messageId === this.currentReply
			},
			messageThreadFilter: messageThreadFilter,
			showReply: function(messageId){
				this.currentReply = messageId;
			},
			cancelReply: function(){
				this.currentReply = null;
			},
			submitReply: function(){
				console.log(replySubmitted);
			},
			getMessageReply: function(){

			}
		})

	};
	forumMessageController.$inject = ['$scope', 'MessageThreadFilter', 'CommunityBreadcrumbService'];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
