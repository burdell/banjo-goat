(function(){
	'use strict';

	var discussionsController = function(NodeMessages, NodeStats, NodeTags){
		this.messageData = NodeMessages.content;
		this.messageCount = NodeMessages.count;
		this.statsData = NodeStats.content;
		this.tagData = NodeTags.content;
	};
	discussionsController.$inject = ['NodeMessages', 'NodeStats', 'NodeTags'];

	angular.module('community-discussions')
		.controller('Discussions', discussionsController);

}());
