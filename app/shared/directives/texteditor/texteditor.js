(function(_, marked){
	'use strict';
	
	function communityTextEditor($timeout, routingService) {
		var link = function(scope, element, attrs, ngModel) {
			scope.texteditor.saveText = function(textString) {
				if (!textString) {
					textString = "";
				}

				var markedDownText = marked(textString, scope.texteditor.markdownOptions);
				ngModel.$setViewValue(markedDownText);
				scope.texteditor.ngModel = markedDownText;
			};
		};

		var controller = function($scope) {
			var ctrl = this;
			
			_.extend(ctrl, {
				editorId: 'community-editor-' + $scope.$id,
				editorHeight: ctrl.height | '150',
				markdownOptions: {
					sanitize: true
				},
				generatedText: "",
				formattingHelpShown: false,
				previewShown: false
			});

		};
		controller.$inject = ['$scope'];

	    var directive = {
	        link: link,
	        controller: controller,
	        require: 'ngModel',
	        templateUrl: 'directives/texteditor/texteditor.html',
	        controllerAs: 'texteditor',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	height: '=editorHeight',
	        	minimalEditor: '@',
	        	placeholder: '@',
	        	hidePreviewLink: '@'
	        }
	    };

	    return directive;
	}
	communityTextEditor.$inject = ['$timeout', 'CommunityRoutingService'];

	angular.module('community.directives')
		.directive('communityTextEditor', communityTextEditor);
		
}(window._, window.marked));