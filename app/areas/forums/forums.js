(function(){
	'use strict';

	var forumController = function($stateParams, nodeStructure, nodeService, forumListFilter){
		nodeService.setNodeStructure(nodeStructure);
		this.currentNode = nodeService.CurrentNode;
		this.forumListFilter = forumListFilter;
	};
	forumController.$inject = ['$stateParams', 'CommunityNodeStructure', 'CommunityNodeService', 'ForumListFilter'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}());
