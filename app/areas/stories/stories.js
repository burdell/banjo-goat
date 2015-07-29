(function(_){
	'use strict';

	var storiesController = function($stateParams, $state, nodeService){
		var ctrl = this;
		nodeService.get().then(function(nodeData){
			_.extend(ctrl, {
				currentNode: nodeData.CurrentNode
			});
		});
	};
	storiesController.$inject = ['$stateParams', '$state', 'CommunityNodeService'];

	angular.module('community.stories')
		.controller('Stories', storiesController);

}(window._));
