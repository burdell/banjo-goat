 
'use strict';

var _ = require('underscore');

require('filters/unformattext.js');
require('filters/timefromnow.js');
require('filters/wordcut.js');

var inboxController = function($location, $scope, $state, breadcrumbService, inboxService, messageFilter){
	var ctrl = this;

	$scope.$on('$stateChangeSuccess', function(){
		ctrl.showDetailLoader = false;
		checkForwardStatus();
	});

	function checkForwardStatus(){
		if ($state.current.name === 'inbox' && ctrl.messageList.content.length > 0) {
			$state.go('inbox.detail', { messageId: ctrl.messageList.content[0].topic.id }, { location: 'replace' });
		}
	}

	function setMessageData(result, updates) {
		ctrl.messageList = result;
		checkForwardStatus();
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
		}
	});
};
inboxController.$inject = [
	'$location',
	'$scope', 
	'$state',
	require('services/breadcrumb.js'), require('services/inbox.js'),  'InboxMessageFilter'];

angular.module('community.directory')
	.controller('InboxController', inboxController);


