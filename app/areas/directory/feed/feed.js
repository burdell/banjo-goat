(function(_){
	'use strict';

	var feedController = function($scope, breadcrumbService, feedFilter){
		var ctrl = this;

		breadcrumbService.setCurrentBreadcrumb(this.story.discussion.subject);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		_.extend(ctrl, {
		});
	};
	feedController.$inject = ['$scope', 'CommunityBreadcrumbService', 'FeedFilter'];

	angular.module('community.directory')
		.controller('Feed', feedController);

}(window._));
