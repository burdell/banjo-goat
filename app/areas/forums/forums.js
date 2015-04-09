(function(){
	'use strict';

	var forumController = function($stateParams, $state, nodeService, forumListFilter){
		var ctrl = this;
		
		_.extend(ctrl, {
			currentNode: nodeService.CurrentNode,
			forumListFilter: forumListFilter,
			hideSearch: function(){
				return $state.current.name === 'forums.message'
			}
		});
	};
	forumController.$inject = ['$stateParams', '$state', 'CommunityNodeService', 'ForumListFilter'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}());
