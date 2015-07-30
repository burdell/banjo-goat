(function(_){
	'use strict';

	var forumNewTopicController = function($scope, $state, communityApi, breadcrumbService, nodeStructure){
		breadcrumbService.setCurrentBreadcrumb('New Topic');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var categoryDisplayId = $state.params.nodeId;

		var ctrl = this;
		_.extend(ctrl, {
			cancelTopic: function() {
				$state.go('forums.list');
			},
			submitTopic: function() {
				communityApi.Forums.message(this.newTopic, true).then(function(result){
					var submittedMessage = result.model;
					$state.go('forums.message', { messageId: submittedMessage.id });
				});
			},
			newTopic: {
			    'body': '',
			    'categoryDisplayId': categoryDisplayId,
			    'subject': ''
			}
		});
		
	};
	forumNewTopicController.$inject = [
		'$scope', 
		'$state', 
		'CommunityApiService', 
		'CommunityBreadcrumbService', 
		'CommunityNodeService'
	];

	angular.module('community.forums')
		.controller('NewForumTopic', forumNewTopicController);

}(window._));