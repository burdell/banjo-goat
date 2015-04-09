(function(_){
	'use strict';

	var forumMessageController = function(messageThread){
		var ctrl = this;
		
		_.extend(ctrl, {
			threadTitle: messageThread[0].subject,
			messageThread: messageThread
		});
		debugger;
	};
	forumMessageController.$inject = ['MessageThread'];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
