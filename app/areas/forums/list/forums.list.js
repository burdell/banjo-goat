(function(_){
	'use strict';

	function ForumListController ($stateParams, dataService, forumListFilter, nodeService, communityApiService){
		var controller = this;

		function setMessageData (result){
			controller.messageList = result.content;
			controller.messageCount = result.next.total;
		}
		
		function getStats(message, statKey) {
			return _.findWhere(message.stats, { key: statKey }).value;
		}

		forumListFilter.set({ onFilter: setMessageData }).filter();

		_.extend(controller, {
			messageSortOptions: dataService.MessageSort,
			forumListFilter: forumListFilter,
			nodeId: $stateParams.nodeId,
			currentNode: nodeService.CurrentNode,
			getMessageData: communityApiService.Forums.message,
			getStats: getStats,
			messageList: []
		});
	}
	ForumListController.$inject = ['$stateParams', 'CommunityDataService', 'ForumListFilter', 'CommunityNodeService', 'CommunityApiService'];

	angular.module('community.forums')
		.controller('ForumList', ForumListController);

}(window._));
