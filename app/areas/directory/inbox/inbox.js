 
'use strict';

var _ = require('underscore');

require('filters/unformattext.js');
require('filters/timefromnow.js');
require('filters/wordcut.js');

var inboxController = function($location, $scope, $state, breadcrumbService, inboxService, messageFilter, localizationService){
	var ctrl = this;

	$scope.$on('$stateChangeStart', function(){
		ctrl.showDetailLoader = true;
	});

	$scope.$on('$stateChangeSuccess', function(){
		ctrl.showDetailLoader = false;
		checkForwardStatus();
		ctrl.refreshMessages(); // refreshes on new message
	});

	function checkForwardStatus(){
		if ($state.current.name === 'inbox' && ctrl.messageList.content.length > 0) {
			$state.go('inbox.detail', { messageId: ctrl.messageList.content[0].topic.id }, { location: 'replace' });
		}
	}

	function setMessageData(result, updates) {
		ctrl.messageList = result;
		checkForwardStatus();

		if (result.totalElements < 1)
			$state.go('inbox.newtopic');
	};
	messageFilter.set({ onFilter: setMessageData });
	var initialNewMessageCount = inboxService.newDataCount;

	_.extend(ctrl, {
		messageFilter: messageFilter,
		getRecipientString: function(recipientData) {
			return inboxService.getRecipientString(recipientData, 2);
		},
		checkNewMessages: function(){
			var messageCount = inboxService.newDataCount;
			return messageCount && (messageCount !== initialNewMessageCount);
		},
		refreshMessages: function(){
			initialNewMessageCount = inboxService.newDataCount;
			messageFilter.filter({ page: 1 });
		},
		isActive: function(currentId){
			if (currentId == $state.params.messageId) return true;
		},
		newThreadCount: function(){
			var messageList = ctrl.messageList;
			var unreadThreads = 0;
			for(var i=0; i<messageList.content.length; i++) {
				if (messageList.content[i].unreadCount > 0)
					unreadThreads++;
			}
			return unreadThreads
		},
		getSubject: function(subject){
			if (subject!="") 
				return subject;
			else 
				return "(" + localizationService.data.directory.inbox.noSubject + ")";
		}
	});
};
inboxController.$inject = [
	'$location',
	'$scope', 
	'$state',
	require('services/breadcrumb.js'),
	require('services/inbox.js'),
	'InboxMessageFilter',
	'CommunityLocalizationService'
];

angular.module('community.directory')
	.controller('InboxController', inboxController);


