(function(_){
	'use strict';

	var forumMessageController = function($scope, messageThreadFilter, breadcrumbService){
		var ctrl = this;
		ctrl.messageThreadFilter = messageThreadFilter;

		function setThreadData(dataResult) {
			ctrl.originalMessage = dataResult[0];
			ctrl.messageThread = dataResult;
			ctrl.allMessageCount = _.findWhere(ctrl.originalMessage.stats, { key: 'comments' }).value + 1;
			
			breadcrumbService.setCurrentBreadcrumb(ctrl.originalMessage.subject);
		}
		messageThreadFilter.set({ onFilter: setThreadData });

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

	};
	forumMessageController.$inject = ['$scope', 'MessageThreadFilter', 'CommunityBreadcrumbService'];

	angular.module('community.forums')
		.controller('ForumMessage', forumMessageController);

}(window._));
