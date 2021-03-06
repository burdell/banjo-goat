
'use strict';

var _ = require('underscore');

require('directives/pager/pager.js');
require('directives/sorter/sorter.js');
require('directives/pagescroll/pagescroll.js');
require('directives/username/username.js');
require('directives/useravatar/useravatar.js');

require('directives/searchbox/searchbox.js');
require('directives/tooltip/tooltip.js');
require('directives/showcount/showcount.js');

require('filters/unescape.js');
require('filters/timefromnow.js');
require('filters/extractkey.js');

function ForumListController ($stateParams, $state, dataService, nodeService, communityApiService, forumListFilter, routingService){
	var controller = this;

	function setMessageData (result){
		controller.messageList = result.content;
		controller.messageCount = result.totalElements;
		controller.numberOfPages = result.totalPages;
	}
	forumListFilter.set({ onFilter: setMessageData });
	
	_.extend(controller, {
		messageSortOptions: dataService.MessageSort,
		forumListFilter: forumListFilter,
		nodeId: $stateParams.nodeId,
		currentNode: nodeService.CurrentNode,
		getMessageData: communityApiService.Forums.message,
		getUserData: communityApiService.Users.userData,
		getMessageUrl: function(messageId){
			return $state.href('forums.detail', { messageId: messageId } );
		},
		startNewTopic: function(){
			$state.go('forums.newtopic');
		},
		go: function(message){
			$state.go('forums.detail', { messageId: message.id });
		},
		getMessageNumber: function(currentListIndex){
			var page = forumListFilter.model('page') || 1;
			return currentListIndex * page;
		},
		isRead: function(forumThread){
			return !!forumThread.context.lastReadDate;
		},
		getProfileUrl: function(id) {
			return routingService.generateUrl('userprofile', { userId: id })
		}
	});
}
ForumListController.$inject = [
	'$stateParams', 
	'$state',
	require('services/data.js'), 
	require('services/nodestructure.js'), 
	require('services/api.js'),
	'ForumListFilter',
	require('services/routing.js')
];

angular.module('community.forums')
	.controller('ForumList', ForumListController);


