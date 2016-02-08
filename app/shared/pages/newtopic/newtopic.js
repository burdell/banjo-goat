
function creatNewTopicPage(areaName) {

	var _ = require('underscore');

	require('directives/userbadge/userbadge.js');
	require('directives/texteditor/texteditor.js');
	require('directives/fileupload/fileupload.js');

	require('services/products.js')

	var newTopicController = function($scope, $state, $templateCache, breadcrumbService, communityApi, localizationService, nodeStructure, routingService){
		var ctrl = this;
		
		var currentNode = null;
		var currentArea = routingService.getCurrentArea();


		nodeStructure.get().then(function(nodeService){
			currentNode = nodeService.getNode($state.params.nodeId);
			if (currentNode) {
				ctrl.newTopic.nodeId = currentNode.id;
			}
		});

		var newTopicStrings = localizationService.data.directives.newtopic;
		var texts = {
			announcements: newTopicStrings.announcements,
			forums: newTopicStrings.forums,
			features: newTopicStrings.features,
			directory: newTopicStrings.directory
		};

		breadcrumbService.setCurrentBreadcrumb(newTopicStrings[currentArea].breadcrumb);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});


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

		var currentAreaTexts = texts[currentArea];
		var submitFunction = this.submitFunction;

		function getNewTopicModel(){
			var baseModel = {
			    'body': '',
			    'nodeId': null,
			    'subject': ''
			};

			return baseModel;
		}

		_.extend(ctrl, {
			cancelTopic: function() {
				$state.go(currentArea + '.list');
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
					routeData[detailId] = result.id;

					$state.go(currentArea + '.detail', routeData);
				}).finally(function(){
					ctrl.submittingTopic = false;
				});
			},
			newTopic: getNewTopicModel(),
			actionButtonText: currentAreaTexts.action,
			feedbackButtonText: currentAreaTexts.feedback,
			titleText: currentAreaTexts.title,
			moreFieldsPartial: areaTemplates[currentArea],
			currentArea: currentArea,
			addAttachment: function(fileData) {
				ctrl.attachmentList.push({
					fileName: fileData.fileName,
					fileUrl: fileData.fileUrl
				})
			},
			attachmentList: []
		});

		if (currentArea !== 'forums') {
			_.extend(ctrl.newTopic, { meta: {} });	
		}
	};
	newTopicController.$inject = [
		'$scope', 
		'$state', 
		'$templateCache',
		require('services/breadcrumb.js'),
		require('services/api.js'), 
		"CommunityLocalizationService",
		require('services/nodestructure.js'),
		require('services/routing.js')
	];

	angular.module('community.' + areaName)
		.controller('NewTopic', newTopicController);


}

module.exports = creatNewTopicPage;