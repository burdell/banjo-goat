(function(_){
	'use strict';

	function ForumListController ($stateParams, dataService, forumListFilter, nodeService, communityApiService){
		var controller = this;

		function setMessageData (result){
			controller.messageList = result.content;
			controller.messageCount = result.next.total;
		}
		forumListFilter.set({ onFilter: setMessageData });
		
		_.extend(controller, {
			messageSortOptions: dataService.MessageSort,
			forumListFilter: forumListFilter,
			nodeId: $stateParams.nodeId,
			currentNode: nodeService.CurrentNode,
			getMessageData: communityApiService.Forums.message
		});
	}
	ForumListController.$inject = ['$stateParams', 'CommunityDataService', 'ForumListFilter', 'CommunityNodeService', 'CommunityApiService'];

	angular.module('community.forums')
		.controller('ForumList', ForumListController);

}(window._));
