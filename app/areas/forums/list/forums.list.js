(function(_){
	'use strict';

	function ForumListController ($stateParams, $state, dataService, forumListFilter, nodeService, communityApiService){
		var controller = this;

		function setMessageData (result){
			controller.messageList = result.collection;
			controller.messageCount = result.next.total;
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

}(window._));
