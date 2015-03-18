(function(_){
	'use strict';

	var forumListController = function(forumMessages, $scope){
		this.messageList = forumMessages.content;
		this.messageCount = forumMessages.count;
		
		this.getStats = function(message, statKey){
			return _.findWhere(message.stats, { key: statKey }).value;
		};
	};
	forumListController.$inject = ['ForumMessages', '$scope'];

	angular.module('community.forums')
		.controller('ForumList', forumListController);

}(window._));
