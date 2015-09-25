(function(_){
	'use strict';

	var forumNewTopicController = function($scope, $state, communityApi, breadcrumbService, nodeStructure){
		breadcrumbService.setCurrentBreadcrumb('New Topic');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		nodeStructure.get().then(function(nodeService){
			var currentNode = nodeService.getNode($state.params.nodeId);
			if (currentNode) {
				ctrl.newTopic.nodeId = currentNode.id;
			}
		});

		var ctrl = this;
		_.extend(ctrl, {
			cancelTopic: function() {
				$state.go('forums.list');
			},
			submitTopic: function() {
				communityApi.Forums.message(this.newTopic).then(function(result){
					var submittedMessage = result;
					$state.go('forums.message', { messageId: submittedMessage.id });
				});
			},
			newTopic: {
			    'body': '',
			    'nodeId': null,
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