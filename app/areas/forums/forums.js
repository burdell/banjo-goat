(function(){
	'use strict';

	var forumController = function($stateParams, nodeService, forumListFilter){
		this.currentNode = nodeService.CurrentNode;
		this.forumListFilter = forumListFilter;
	};
	forumController.$inject = ['$stateParams', 'CommunityNodeService', 'ForumListFilter'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}());
