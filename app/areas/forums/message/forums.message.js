(function(_){
	'use strict';

	var forumMessageController = function(messageThreadFilter){
		var ctrl = this;
		
		function setThreadData(dataResult) {
			ctrl.originalMessage = dataResult[0];
			ctrl.messageThread = dataResult;
		}
		messageThreadFilter.set({ onFilter: setThreadData });
	};
	forumMessageController.$inject = ['MessageThreadFilter'];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
