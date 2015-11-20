
'use strict';

var _ = require('underscore');

require('directives/userbadge/userbadge.js');
require('directives/texteditor/texteditor.js');

require('services/products.js')

function newTopic() {
	function controller($state, communityApi, nodeStructure, routingService) {	
		var ctrl = this;

		var currentNode = null;
		var currentArea = routingService.getCurrentArea();


		nodeStructure.get().then(function(nodeService){
			currentNode = nodeService.getNode($state.params.nodeId);
			if (currentNode) {
				ctrl.newTopic.nodeId = currentNode.id;
			}
		});

		var texts = {
			announcements: { 
				action: 'Post Announcement', 
				feedback: 'Posting Your Announcement',
				title: 'Give your Announcement a title' 
			},
			forums: { 
				action: 'Post Topic', 
				feedback: 'Posting Your Topic',
				title: 'Give your Topic a title' 

			},
			features: { 
				action: 'Submit Feature Request', 
				feedback: 'Submitting Your Feature Request',
				title: 'Give your Feature Request a title' 
			},
			directory: {
				action: 'Submit New Message',
				feedback: 'Submitting Your Message',
				title: 'Give your message a title'
			}
		};

		var areaConfig = {
			directory: {
				userSearch: true,
				noCancel: true
			}
		}

		var currentAreaTexts = texts[currentArea];
		var submitFunction = this.submitFunction

		_.extend(ctrl, {
			cancelTopic: function() {
				$state.go(currentArea + '.list');
			},
			submitTopic: function() {
				ctrl.submittingTopic = true;

				if (currentArea.directory) {
					this.newTopic.recipientIds.push(3);	
				}

				communityApi.Messages.topic.apply(communityApi, [currentArea, this.newTopic]).then(function(result){
					var detailId = routingService.getDetailId(currentArea);
					var routeData = {};
					routeData[detailId] = result.id;

					$state.go(currentArea + '.detail', routeData);
				}).finally(function(){
					ctrl.submittingTopic = false;
				});
			},
			newTopic: {
			    'body': '',
			    'nodeId': null,
			    'subject': ''
			},
			actionButtonText: currentAreaTexts.action,
			feedbackButtonText: currentAreaTexts.feedback,
			titleText: currentAreaTexts.title
		});


		if (currentArea !== 'forums') {
			_.extend(ctrl.newTopic, { meta: {} });	
		}

		if (currentArea === 'directory') {
			_.extend(ctrl, {
				config: areaConfig.directory,
				searchedUsers: [],
				searchUsers: function(searchTerm){
					if (searchTerm && searchTerm.length > 1) {
						communityApi.Users.search(searchTerm).then(function(result){
							ctrl.searchedUsers = _.filter(result.content, function(user){
								return _.indexOf(ctrl.newTopic.recipients, user.id) < 0;
							})
						});
					}
				}
			});
			_.extend(ctrl.newTopic, { recipientIds: [] })
		}
	}
	controller.$inject = [	
		'$state', 
		require('services/api.js'), 
		require('services/nodestructure.js'),
		require('services/routing.js')
	];
	    
	    var directive = {
	        controller: controller,
	        templateUrl: 'directives/newtopic/newtopic.html',
	        restrict: 'E',
	        controllerAs: 'newtopic',
	        bindToController: true,
	        replace: true,
	        scope: {
	        	submitFunction: '@'
	        }
	    };

    return directive;
}

angular.module('community.directives')
	.directive('communityNewTopic', newTopic);
