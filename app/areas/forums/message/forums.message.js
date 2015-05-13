(function(_){
	'use strict';

	var forumMessageController = function($anchorScroll, $location, $scope, $timeout, communityApi, breadcrumbService, messageThreadFilter){
		var ctrl = this;
		var setMessageBreadcrumb = _.once(_.bind(breadcrumbService.setCurrentBreadcrumb, breadcrumbService));

		function setThreadData(dataResult) {
			ctrl.originalMessage = dataResult.originalMessage;
			
			var messageThread = dataResult.comments;
			if (!messageThreadFilter.model('offset')) {
				messageThread.unshift(ctrl.originalMessage);
			}
			ctrl.messageThread = messageThread;
			ctrl.allMessageCount = _.findWhere(ctrl.originalMessage.stats, { key: 'comments' }).value;
			setMessageBreadcrumb(ctrl.originalMessage.subject);
		}
		messageThreadFilter.set({ onFilter: setThreadData });

		function clearMessageReplyText(){
			ctrl.messageReplyText = null;
		}

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var linkedMessage = $location.hash();
		if (linkedMessage){
			$timeout(function(){
				$anchorScroll();
			}, 0);
		}		

		_.extend(ctrl, {
			currentReply: null,
			messageReplyText: null,
			messageThreadFilter: messageThreadFilter,
			linkedMessageId: Number(linkedMessage),
			messageIsBeingRepliedTo: function(messageId){
				return messageId === this.currentReply;
			},
			showReply: function(messageId){
				clearMessageReplyText();
				this.currentReply = messageId;
			},
			cancelReply: function(){
				this.currentReply = null;
			},
			submitReply: function(messageRepliedTo){
				// communityApi.Forums.message({
				// 	body: this.messageReplyText,
				// 	categoryId: null,
				// 	subject: '',
				// 	replyTo: messageRepliedTo,
				// }, true).then(function(result){
				// 	ctrl.currentReply = null;
				// 	var submittedMessage = result.model;

				// 	var offset = messageThreadFilter.model('offset') || 0;
				// 	var limit = messageThreadFilter.model('limit');
					
				// 	var totalNumberOfPages = Math.floor((ctrl.allMessageCount) / limit);
				// 	var currentPageNumber = Math.floor(offset / limit) + 1;
					
				// 	if (currentPageNumber !== (totalNumberOfPages + 1)) {
				// 		//if we're not on the last page, go to  page...
				// 		messageThreadFilter.filter({ offset: totalNumberOfPages * limit });
				// 			// .then(function(){
				// 			// 	submittedMessage.author = currentUser;
				// 			// 	ctrl.messageThread.push(submittedMessage);
				// 			// });
				// 	} else {
				// 		//...otherwise just add the new message to the list
				// 		// ctrl.allMessageCount += 1;
				// 		// submittedMessage.author = currentUser;
				// 		// ctrl.messageThread.push(submittedMessage);
				// 	}
				// });
				
			}
		});

	};
	forumMessageController.$inject = [
		'$anchorScroll',
		'$location',
		'$scope',
		'$timeout',
		'CommunityApiService',
		'CommunityBreadcrumbService', 
		'MessageThreadFilter'
	];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
