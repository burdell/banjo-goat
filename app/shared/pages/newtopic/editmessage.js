
function creatNewTopicPage(areaName) {

	var _ = require('underscore');

	require('directives/userbadge/userbadge.js');
	require('directives/texteditor/texteditor.js');

	var editMessageController = function($scope, $state, $templateCache, breadcrumbService, communityApi, routingService, messageDetail){
		var ctrl = this;

		var context = messageDetail.message ? messageDetail.message.context : messageDetail.context;
		breadcrumbService.setCurrentBreadcrumb(messageDetail.subject || context.topicSubject);
		 

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var currentNode = null;
		var currentArea = routingService.getCurrentArea();

		var areaConfig = {
			directory: {
				userSearch: true,
				noCancel: true
			}
		}

		var baseAreaTemplates = 'pages/newtopic/areapartials/';
		var areaTemplates = {
			announcements: baseAreaTemplates + 'announcements.html',
			features: baseAreaTemplates + 'features.html'
		}


		var submitFunction = this.submitFunction;

		var editType = $state.params.messageType;
		var topicId = messageDetail.topicId || messageDetail.message.topicId

		function getNewTopicModel(){
			var baseModel = {
			    id: messageDetail.id,
				body: messageDetail.body || messageDetail.message.body, 
				nodeId: messageDetail.node.id,
				subject: messageDetail.subject,
				topicId: topicId,
				parentId: messageDetail.parentId
			};

			if (currentArea !== 'forums') {
				baseModel.meta = {};
			}

			if (currentArea === 'features') {
				baseModel.state = messageDetail.state;
			}

			return baseModel;
		}

		_.extend(ctrl, {
			cancelTopic: function() {
				var stateOptions = {
					nodeId: $state.params.nodeId
				}

				stateOptions[routingService.getDetailId(currentArea)] = topicId;
				$state.go(currentArea + '.detail', stateOptions);
			},
			submitTopic: function() {
				ctrl.submittingTopic = true;

				var messagePromise;
				if (ctrl.editType === 'comment') {
					messagePromise = communityApi.Messages.message(this.newTopic);
				} else {
					messagePromise = communityApi.Messages.topic.apply(communityApi, [currentArea, this.newTopic]);
				}
 
				messagePromise.then(function(result){
					var detailId = routingService.getDetailId(currentArea);
					var routeData = {};
					routeData[detailId] = topicId;

					var toParams = null;
					if (result.id !== topicId) {
						toParams = { targetHash: result.id };
					}

					$state.go(currentArea + '.detail', routeData, toParams);
				}).finally(function(){
					ctrl.submittingTopic = false;
				});
			},
			newTopic: getNewTopicModel(),
			actionButtonText: 'Submit Changes',
			feedbackButtonText: 'Submitting your changes',
			titleText: 'Title',
			editType: editType,
			moreFieldsPartial: areaTemplates[currentArea]
		});
	};
	editMessageController.$inject = [
		'$scope', 
		'$state', 
		'$templateCache',
		require('services/breadcrumb.js'),
		require('services/api.js'), 
		require('services/routing.js'),
		'MessageDetail'
	];

	angular.module('community.' + areaName)
		.controller('EditMessage', editMessageController);


}

module.exports = creatNewTopicPage;