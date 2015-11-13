
'use strict';

var _ = require('underscore');
var SimpleMDE = require('simplemde');
var $ = require('jquery');
var marked = require('marked');

function communityTextEditor($timeout, routingService) {
	var link = function(scope, element, attrs, ngModel) {
		var textarea = element.find('textarea')[0];
		
		var editorCtrl = scope.texteditor;

		var editorOptions = {
			element: $(element).find('.texteditor__editor')[0],
			autofocus: (editorCtrl.autoFocus || _.isUndefined(editorCtrl.autofocus)) ? true : false,
			status: false,
			hideIcons: ['side-by-side', 'preview', 'fullscreen', 'guide'],
		    renderingConfig: {
		        singleLineBreaks: true
		    }
		};

		var isMinimal = !!editorCtrl.minimalEditor;
		if (isMinimal) {
			_.extend(editorOptions, {
				// toolbar: false
			})
		}

		var editorInstance = new SimpleMDE(editorOptions);
		editorInstance.codemirror.on('changes', function(){
			var markedDownText = marked(editorInstance.value(), editorCtrl.markdownOptions);
			ngModel.$setViewValue(markedDownText);
			editorCtrl.ngModel = markedDownText;
		});
	};

	var controller = function($scope) {
		var ctrl = this;

		_.extend(ctrl, {
			editorId: 'community-editor-' + $scope.$id,
			editorHeight: ctrl.height | '150',
			markdownOptions: {
				sanitize: true,
				breaks: true
			}
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
        	hidePreviewLink: '@',
        	autofocus: '='
        }
    };

    return directive;
}
communityTextEditor.$inject = ['$timeout', require('services/routing.js')];

angular.module('community.directives')
	.directive('communityTextEditor', communityTextEditor);
	
