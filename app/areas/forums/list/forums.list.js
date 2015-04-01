(function(_){
	'use strict';

	function ForumListController ($stateParams, dataService, forumListFilter, forumListService, nodeService){
		this.messageSortOptions = dataService.MessageSort;
		this.forumListFilter = forumListFilter;
		this.nodeId = $stateParams.nodeId;
		this.forumListService = forumListService;
		this.currentNode = nodeService.CurrentNode;
		
		var controller = this;
		this.forumListFilter.filter().then(function(result){
			forumListService.MessageList = result.content;
			controller.messageCount = result.next.total;
		});
	}

	ForumListController.prototype.getStats = function(message, statKey){
		return _.findWhere(message.stats, { key: statKey }).value;
	};

	ForumListController.$inject = ['$stateParams', 'CommunityDataService', 'ForumListFilter', 'ForumListService', 'CommunityNodeService'];

	angular.module('community.forums')
		.controller('ForumList', ForumListController);

}(window._));
