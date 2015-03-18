(function(){
	'use strict';

	var forumController = function($stateParams){
		this.nodeId = $stateParams.nodeId;
	};
	forumController.$inject = ['$stateParams'];

	angular.module('community.forums')
		.controller('Forum', forumController);

}());
