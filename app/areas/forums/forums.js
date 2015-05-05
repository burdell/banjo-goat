(function(_){
	'use strict';

	var forumController = function($stateParams, $state, nodeService){
		var ctrl = this;
		
		_.extend(ctrl, {
			currentNode: nodeService.CurrentNode
		});
	};
	forumController.$inject = ['$stateParams', '$state', 'CommunityNodeService'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}(window._));
