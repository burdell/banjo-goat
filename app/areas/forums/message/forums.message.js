
	'use strict';

	var _ = require('underscore');

	require('services/api.js');
	require('services/breadcrumb.js');

	require('directives/pager/pager.js');
	require('directives/commentform/commentform.js');
	require('directives/message/message.js');

	var forumMessageController = function($anchorScroll, $location, $scope, $stateParams, $timeout, communityApi, breadcrumbService, messageThreadFilter){
		var ctrl = this;
		var setMessageBreadcrumb = _.once(_.bind(breadcrumbService.setCurrentBreadcrumb, breadcrumbService));
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
				ctrl.currentReply = messageId;
			},
			cancelReply: function(){
				this.currentReply = null;
			},
			replyPosted: function(result){
				if (ctrl.numberOfPages > 1) {
					messageThreadFilter.filter({ page: ctrl.numberOfPages });
				} else {
					ctrl.messageThread.push(result);
				}
			},
			showTopicReply: function(){
				ctrl.topicReplyShown = true
			}
		});

	};
	forumMessageController.$inject = [
		'$anchorScroll',
		'$location',
		'$scope',
		'$stateParams',
		'$timeout',
		'CommunityApiService',
		'CommunityBreadcrumbService', 
		'MessageThreadFilter'
	];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

