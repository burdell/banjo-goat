(function(_){
	'use strict';

	var forumNewTopicController = function($scope, $state, communityApi, breadcrumbService, currentUser){
		breadcrumbService.setCurrentBreadcrumb("New Topic");

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var ctrl = this;
		var currentUser = currentUser.get();
		_.extend(ctrl, {
			currentUser: currentUser,
			cancelTopic: function() {
				$state.go('forums.list');
			},
			submitTopic: function() {
				communityApi.Forums.message(this.newTopic, true).then(function(result){
					$state.go('forums.message', { messageId: 537138 });
				});
			},
			newTopic: {
				authorId: currentUser.id,
				body: '',
				categoryId: null,
				subject: ''
			}
		});
		
	};
	forumNewTopicController.$inject = ['$scope', '$state', 'CommunityApiService', 'CommunityBreadcrumbService', 'CurrentUserService'];

	angular.module('community.forums')
		.controller('NewForumTopic', forumNewTopicController);

}(window._));