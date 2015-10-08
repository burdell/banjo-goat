
'use strict';

require('services/nodestructure.js');

var _ = require('underscore');

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


