(function(_){
	'use strict';

	function ForumListController ($stateParams, $state, dataService, forumListFilter, nodeService, communityApiService){
		var controller = this;

		function setMessageData (result){
			controller.messageList = result.collection;
			controller.messageCount = result.next.total;
		}
		forumListFilter.set({ onFilter: setMessageData });
		
		_.extend(controller, {
			messageSortOptions: dataService.MessageSort,
			forumListFilter: forumListFilter,
			nodeId: $stateParams.nodeId,
			currentNode: nodeService.CurrentNode,
			getMessageData: communityApiService.Forums.message,
			getMessageUrl: function(messageId){
				return $state.href('forums.message', { messageId: messageId });
			},
			startNewTopic: function(){
				$state.go('forums.newtopic');
			},
			go: function(message){
				// Jan: sorry I added this hack :)
				// window.location.href = $state.href('forums.message', { messageId: message.id });
				$state.go('forums.message', { messageId: message.id });
			}
		});
	}
	ForumListController.$inject = [
		'$stateParams', 
		'$state',
		'CommunityDataService', 
		'ForumListFilter', 
		'CommunityNodeService', 
		'CommunityApiService'
	];

	angular.module('community.forums')
		.controller('ForumList', ForumListController);

}(window._));
