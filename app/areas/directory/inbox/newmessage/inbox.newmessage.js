
'use strict';

var _ = require('underscore');

require('directives/userbadge/userbadge.js');
require('directives/texteditor/texteditor.js');

require('services/products.js')

function newMessage($state, $scope, breadcrumbService, communityApi, currentUserService, localizationService, routingService) {	
	var ctrl = this;

	breadcrumbService.setCurrentBreadcrumb(localizationService.data.directory.inbox.newMessage);
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});

	var currentUserId = null;
	currentUserService.get().then(function(userObj){
		currentUserId = userObj.user.id;
	});

	_.extend(ctrl, {
		searchedUsers: [],
		searchUsers: function(searchTerm){
			if (searchTerm && searchTerm.length > 1) {
				communityApi.Users.search(searchTerm).then(function(result){
					ctrl.searchedUsers = _.filter(result.content, function(user){
						return (user.id !== currentUserId) && (_.indexOf(ctrl.newTopic.recipientIds, user.id) < 0);
					})
				});
			}
		},
		submitTopic: function() {
			ctrl.submittingTopic = true;
			console.log(ctrl.newTopic.recipientIds);

			ctrl.newTopic.recipientIds.push(currentUserId);
			communityApi.Feed.inboxMessage(this.newTopic).then(function(result){
				var newMessage = result.messages.content[0];
				$state.go('inbox.detail', { messageId: newMessage.id });
			}).finally(function(){
				ctrl.submittingTopic = false;
			});
		},
		newTopic: {
		    'body': '',
		    'subject': '',
		    'recipientIds': []
		}
	});
}

newMessage.$inject = [	
	'$state', 
	'$scope',
	require('services/breadcrumb.js'),
	require('services/api.js'), 
	require('services/currentuser.js'),
	"CommunityLocalizationService",
	require('services/routing.js')
];

angular.module('community.directory')
	.controller('NewMessageController', newMessage);
