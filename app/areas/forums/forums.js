(function(){
	'use strict';

	var forumController = function($stateParams, $state, nodeService){
		var ctrl = this;
		
		_.extend(ctrl, {
			currentNode: nodeService.CurrentNode,
			hideSearch: function(){
				return $state.current.name === 'forums.message'
			}
		});
	};
	forumController.$inject = ['$stateParams', '$state', 'CommunityNodeService'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}());
