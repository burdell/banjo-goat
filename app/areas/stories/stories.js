(function(_){
	'use strict';

	var storiesController = function($stateParams, $state, nodeService){
		var ctrl = this;
		
		_.extend(ctrl, {
			currentNode: nodeService.CurrentNode
		});
	};
	storiesController.$inject = ['$stateParams', '$state', 'CommunityNodeService'];

	angular.module('community.stories')
		.controller('Stories', storiesController);

}(window._));
