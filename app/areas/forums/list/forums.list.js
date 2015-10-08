
'use strict';

var _ = require('underscore');

require('services/nodestructure.js');
require('services/api.js');
require('services/data.js');

require('directives/pager/pager.js');
require('directives/sorter/sorter.js');
require('directives/pagescroll/pagescroll.js');
require('directives/username/username.js');
require('directives/searchbox/searchbox.js');
require('directives/tooltip/tooltip.js');

require('filters/unescape.js');
require('filters/timefromnow.js');
require('filters/extractkey.js');

function ForumListController ($stateParams, $state, dataService, forumListFilter, nodeService, communityApiService){
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
		getMessageUrl: function(messageId){
			return $state.href('forums.message', { messageId: messageId });
		},
		startNewTopic: function(){
			$state.go('forums.newtopic');
		},
		go: function(message){
			// Jan: sorry I added this hack :)
			// window.location.href = $state.href('forums.message', { messageId: message.id });
			$state.go('forums.message', { messageId: message.id });
		}
	});
}
ForumListController.$inject = [
	'$stateParams', 
	'$state',
	'CommunityDataService', 
	'ForumListFilter', 
	'CommunityNodeService', 
	'CommunityApiService'
];

angular.module('community.forums')
	.controller('ForumList', ForumListController);


