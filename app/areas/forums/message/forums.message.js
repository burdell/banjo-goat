
	'use strict';

	var _ = require('underscore');

	require('directives/pager/pager.js');
	require('directives/commentform/commentform.js');
	require('directives/message/message.js');

	var forumMessageController = function($scope, $stateParams, communityApi, breadcrumbService, scrollService, messageThreadFilter){
		var ctrl = this;
		
		var setMessageBreadcrumb = _.once(_.bind(breadcrumbService.setCurrentBreadcrumb, breadcrumbService));
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
		
		var setReplyMessage = _.once(function(message){
			ctrl.topicReplyMessage = {
				id: message.id,
				topicId: message.topicId,
				node: message.node
			}
		});

		function setThreadData(dataResult) {	
			ctrl.originalMessage = dataResult.content[0];
			ctrl.originalMessageSubject = ctrl.originalMessage.context.topicSubject;
			
			ctrl.messageThread = dataResult.content;;
			ctrl.allMessageCount = dataResult.totalElements;
			ctrl.numberOfPages = dataResult.totalPages;

			setMessageBreadcrumb(ctrl.originalMessageSubject);
			setReplyMessage(ctrl.originalMessage);
		}
		messageThreadFilter.set({ onFilter: setThreadData });
	
		_.extend(ctrl, {
			currentReply: null,
			messageReplyText: null,
			messageThreadFilter: messageThreadFilter,
			messageIsBeingRepliedTo: function(messageId){
				return messageId === this.currentReply;
			},
			showReply: function(messageId){
				ctrl.currentReply = messageId;
			},
			cancelReply: function(){
				this.currentReply = null;
			},
			replyPosted: function(result){
				messageThreadFilter.filter({ page: ctrl.numberOfPages });
				scrollService.scroll(result.id);
			},
			showTopicReply: function(){
				ctrl.topicReplyShown = true
				scrollService.scroll('topicReply');
			}
		});

	};
	forumMessageController.$inject = [
		'$scope',
		'$stateParams',
		require('services/api.js'),
		require('services/breadcrumb.js'),
		require('services/scroll.js'),
		'MessageThreadFilter'
	];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

