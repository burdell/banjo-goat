(function(){
	'use strict';

	var forumController = function(NodeMessages, NodeStats, NodeTags){
		this.nodeName = 'AirMax';
		this.nodeId = 5;

		this.messageData = NodeMessages.content;
		this.messageCount = NodeMessages.count;
		this.statsData = NodeStats.content;
		this.tagData = NodeTags.content;
	};
	forumController.$inject = ['NodeMessages', 'NodeStats', 'NodeTags'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}());
