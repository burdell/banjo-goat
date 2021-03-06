 
'use strict';

var _ = require('underscore');

require('filters/unformattext.js');
require('filters/timefromnow.js');
require('filters/sanitize');

require('directives/userbadge/userbadge.js');
require('directives/texteditor/texteditor.js');
require('directives/pager/pager.js');
require('directives/attachmentdisplay/attachmentdisplay.js');

var inboxMessageController = function($scope, $state, $interval, $stateParams, breadcrumbService, inboxService, apiService, inboxThreadFilter, communityApi, currentUserService, timeFromNow, localizationService){
	var ctrl = this;

	var currentUserId = null;
	currentUserService.get().then(function(userObj){
		currentUserId = userObj.user.id;
		ctrl.currentUser = userObj.user;
	});

	$scope.$on('$stateChangeStart', function(e, targetState){
		//kind of weird scenario. the base inbox state directs back to the detail, so the clean function will be called twice without this check
		if (targetState.name !== 'inbox') {
			breadcrumbService.clearCurrentBreadcrumb();
		}
	});
	var setOriginalData = _.once(function(message, recipients){
		ctrl.originalMessage = message;
		ctrl.recipientString = inboxService.getRecipientString(recipients, 10)

		breadcrumbService.setCurrentBreadcrumb(ctrl.originalMessage.subject);
	});
	
	function setThreadData(result) {
		ctrl.messageList = result.messages;
		ctrl.numberOfPages = result.messages.totalPages;
		setOriginalData(ctrl.messageList.content[0], result.recipients);
	};
	inboxThreadFilter.set({ onFilter: setThreadData });
	inboxThreadFilter.filter({ page: ctrl.numberOfPages }); // turn to the last page

	var messagesPerPage = inboxThreadFilter.model('per_page');
	var topicId = Number($stateParams.messageId);


	// check for updates; stop when not on message
	var checker;
	function stopChecking() {
		$interval.cancel(checker);
	}
	checker = $interval(function() {
        if (ctrl.originalMessage.id != $state.params.messageId)
        	stopChecking();

        // only load new data when viewing the last page or when page first loaded, or the page will jump
        var currentPage = ctrl.threadFilter.model('page');
        if (currentPage == ctrl.numberOfPages || typeof(currentPage) == "undefined") {
			var messageData = ctrl.messageList;
			var targetPage = Math.ceil( (messageData.totalElements+1) / messagesPerPage);
			inboxThreadFilter.filter({ page: targetPage });
		}
    }, 5000);
	_.extend(ctrl, {
		curUserLogin: "",
		isNewUser: function(user, index){
			if (index == 0) {
				ctrl.curUserLogin = user.login;
				return true;
			}

			if ( ctrl.curUserLogin != user.login ) {
				ctrl.curUserLogin = user.login;
				return true;
			}
			ctrl.curUserLogin = user.login;
		},
		curDate: null,
		isNewDate: function(curDate){
			curDate = timeFromNow(curDate);

			if ( ctrl.curDate != curDate ) {
				ctrl.curDate = curDate;
				return true;
			}
			ctrl.curDate = curDate;
			return false
		},
		getSubject: function() {
			if (ctrl.originalMessage.subject!="") 
				return ctrl.originalMessage.subject;
			else 
				return "(" + localizationService.data.directory.inbox.noSubject + ")";
		},
		searchedUsers: [],
		searchUsers: function(searchTerm){
			if (searchTerm && searchTerm.length > 1) {
				communityApi.Users.search(searchTerm).then(function(result){
					ctrl.searchedUsers = _.filter(result.content, function(user){
						return user.id
						// return (user.id !== currentUserId) && (_.indexOf(ctrl.newTopic.recipientIds, user.id) < 0);
					})
				});
			}
		},
		threadFilter: inboxThreadFilter,
		newMessage: {
			body: '',
			topicId: topicId
		},
		postNewMessage: function(){
			if (ctrl.newMessage.body) {
				ctrl.submittingReply = true;
				apiService.Feed.inboxMessage(ctrl.newMessage).then(function(result){
					ctrl.newMessage.body = null;
					ctrl.newMessage.attachments = null;

					var messageData = result.messages;
					var targetPage = Math.ceil(messageData.totalElements / messagesPerPage);
					inboxThreadFilter.filter({ page: targetPage });
				}).finally(function(){
					ctrl.submittingReply = false;
				});
			}
		},
		currentUser: ""
	});
};
inboxMessageController.$inject = [
	'$scope', 
	'$state', 
	'$interval', 
	'$stateParams',
	require('services/breadcrumb.js'),
	require('services/inbox.js'),
	require('services/api.js'),
	'InboxThreadFilter',
	require('services/api.js'),
	require('services/currentuser.js'),
	require('filters/timefromnow.js'),
	'CommunityLocalizationService'
];

angular.module('community.directory')
	.controller('InboxMessageController', inboxMessageController);


