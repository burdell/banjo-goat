
	'use strict';

	var _ = require('underscore');

	require('directives/pager/pager.js');
	require('directives/commentform/commentform.js');
	require('directives/message/message.js');

	var forumMessageController = function($scope, $stateParams, $timeout, communityApi, breadcrumbService, scrollService, messageThreadFilter){
		var ctrl = this;
		ctrl.replyMessage = {
			id: null,
			topicId: null,
			node: null,
			parentId: null
		};
		
		var setMessageBreadcrumb = _.once(_.bind(breadcrumbService.setCurrentBreadcrumb, breadcrumbService));
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
		
		var setReplyMessage = _.once(function(message){
			var replyMessage = ctrl.replyMessage;
			
			replyMessage.topicId = message.id;
			replyMessage.node = message.node;
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
			showReply: function(message){
				ctrl.showTopicReply();

				$timeout(function(){
					ctrl.replyMessage.parentId = message.id;
					$scope.$broadcast('texteditor:addQuote', message);
				}, 0);
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
		'$timeout',
		require('services/api.js'),
		require('services/breadcrumb.js'),
		require('services/scroll.js'),
		'MessageThreadFilter'
	];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

