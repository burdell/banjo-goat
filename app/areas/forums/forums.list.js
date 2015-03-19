(function(_){
	'use strict';

	var forumListController = function(forumMessages, dataService, filterService){
		this.messageSortOptions = dataService.MessageSort;
		this.messageList = forumMessages.content;
		this.messageCount = forumMessages.count;
		this.forumListFilter = filterService.getNewFilter();

		this.getStats = function(message, statKey){
			return _.findWhere(message.stats, { key: statKey }).value;
		};
	};
	forumListController.$inject = ['ForumMessages', 'CommunityDataService', 'CommunityFilterService'];

	angular.module('community.forums')
		.controller('ForumList', forumListController);

}(window._));
