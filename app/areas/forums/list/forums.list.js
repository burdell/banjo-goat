(function(_){
	'use strict';

	function ForumListController ($stateParams, dataService, forumListFilter, forumListService, nodeService, communityApiService){
		var controller = this;

		forumListFilter.filter().then(function(result){
			forumListService.MessageList = result.content;
			controller.messageCount = result.next.total;
		});

		function GetStats(message, statKey) {
			return _.findWhere(message.stats, { key: statKey }).value;
		};

		_.extend(controller, {
			messageSortOptions: dataService.MessageSort,
			forumListFilter: forumListFilter,
			nodeId: $stateParams.nodeId,
			forumListService: forumListService,
			currentNode: nodeService.CurrentNode,
			getMessageData: communityApiService.Forums.message,
			getStats: GetStats
		});
	}

	ForumListController.$inject = ['$stateParams', 'CommunityDataService', 'ForumListFilter', 'ForumListService', 'CommunityNodeService', 'CommunityApiService'];

	angular.module('community.forums')
		.controller('ForumList', ForumListController);

}(window._));
