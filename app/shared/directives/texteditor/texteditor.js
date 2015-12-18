
'use strict';

var _ = require('underscore');
var SimpleMDE = require('simplemde');
var $ = require('jquery');
var marked = require('marked');
var toMarkdown = require('to-markdown');

function communityTextEditor($timeout, localizationService, routingService) {
	var link = function(scope, element, attrs, ngModel) {
		var textarea = element.find('textarea')[0];
		
		var editorCtrl = scope.texteditor;

		var isAutofocus = (editorCtrl.autofocus == "true");
		var fuckYou = localizationService;
		
		var editorOptions = {
			element: $(element).find('.texteditor__editor')[0],
			autofocus: isAutofocus,
			status: false,
			hideIcons: ['side-by-side', 'preview', 'fullscreen', 'guide'],
		    renderingConfig: {
		        singleLineBreaks: true
		    },
		    spellChecker: localizationService.currentLocale === 'en'
		};

		var isMinimal = (editorCtrl.minimalEditor == "true"); // unfancy but works
		if (isMinimal) {
			_.extend(editorOptions, {
				toolbar: false
			})
		}

		var editorInstance = new SimpleMDE(editorOptions);
		editorInstance.codemirror.on('changes', function(){
			var markedDownText = marked(editorInstance.value(), editorCtrl.markdownOptions);
			ngModel.$setViewValue(markedDownText);
			editorCtrl.ngModel = markedDownText;
		});

		scope.texteditor.setValue = function(value){
			if (!value) {
				value = '';
			}
			editorInstance.value(value);
		}

		var initialValue = editorCtrl.ngModel;
		if (initialValue) {
			var markedDownValue = toMarkdown(initialValue);
			editorCtrl.setValue(markedDownValue);
		}
	};

	var controller = function($scope) {
		var ctrl = this;

		$scope.$watch(function(){ return ctrl.ngModel; }, function(value){
			if (!value) {
				ctrl.setValue();
			}
		}, true);

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
        	ngModel: '=',
        	height: '=editorHeight',
        	minimalEditor: '@',
        	placeholder: '@',
        	hidePreviewLink: '@',
        	autofocus: '@' // note that autofocus causes the browser to scroll to the textbox
        }
    };

    return directive;
}
communityTextEditor.$inject = ['$timeout', 'CommunityLocalizationService', require('services/routing.js')];

angular.module('community.directives')
	.directive('communityTextEditor', communityTextEditor);
	
