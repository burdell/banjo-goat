(function(_){
	'use strict';

	var forumNewTopicController = function($scope, $state, communityApi, breadcrumbService, nodeStructure, currentUserService){
		breadcrumbService.setCurrentBreadcrumb('New Topic');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var categoryDisplayId = nodeStructure.CurrentNode.urlSlug;

		var ctrl = this;
		var currentUser = currentUserService.get();
		_.extend(ctrl, {
			currentUser: currentUser,
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
			    'currentUserId': currentUser.id,
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
		'CommunityNodeService',
		'CurrentUserService'
	];

	angular.module('community.forums')
		.controller('NewForumTopic', forumNewTopicController);

}(window._));