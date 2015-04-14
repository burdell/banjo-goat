(function(_){
	'use strict';

	var forumMessageController = function($scope, messageThreadFilter, nodeService){
		var ctrl = this;
		function setThreadData(dataResult) {
			ctrl.originalMessage = dataResult[0];
			nodeService.setCurrentSubnode(ctrl.originalMessage.subject);
			ctrl.messageThread = dataResult;
		}
		messageThreadFilter.set({ onFilter: setThreadData });

		$scope.$on('$stateChangeStart', function(){
			nodeService.clearCurrentSubnode();
		});

	};
	forumMessageController.$inject = ['$scope', 'MessageThreadFilter', 'CommunityNodeService'];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
