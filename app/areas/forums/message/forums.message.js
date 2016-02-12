
	'use strict';

	var _ = require('underscore');

	require('directives/pager/pager.js');
	require('directives/commentform/commentform.js');
	require('directives/message/message.js');

	var forumMessageController = function($scope, $state, $stateParams, $timeout, communityApi, breadcrumbService, permissionsService, routingService, scrollService, messageThreadFilter){
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
			replyMessage.parentId = message.id;
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
		
		ctrl.editUrl = routingService.generateUrl(routingService.getCurrentArea() + '.edit', { 
			nodeId: $state.params.nodeId, 
			id: ctrl.originalMessage.id,
			messageType: 'topic'
		});

		_.extend(ctrl, {
			currentReply: null,
			messageReplyText: null,
			topicReplyShown: false,
			messageThreadFilter: messageThreadFilter,
			messageIsBeingRepliedTo: function(messageId){
				return messageId === this.currentReply;
			},
			showReply: function(message){
				ctrl.replyMessage.parentId = message.id;
				
				if (ctrl.topicReplyShown){
					$timeout(function(){
						$scope.$broadcast('texteditor:addQuote', message);
					}, 0);
				}
				
				ctrl.showTopicReply();
			},
			cancelReply: function(){
				this.currentReply = null;
			},
			replyPosted: function(result){
				messageThreadFilter.filter({ page: ctrl.numberOfPages });
				scrollService.scroll(result.id);
			},
			showTopicReply: function(){
				ctrl.topicReplyShown = true;
				scrollService.scroll('topicReply');
			},
			isEdited: ctrl.originalMessage.editDate && (ctrl.originalMessage.postDate != ctrl.originalMessage.editDate)
		});

	};
	forumMessageController.$inject = [
		'$scope',
		'$state', 
		'$stateParams',
		'$timeout',
		require('services/api.js'),
		require('services/breadcrumb.js'),
		require('services/permissions.js'),
		require('services/routing.js'),
		require('services/scroll.js'),
		'MessageThreadFilter'
	];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

