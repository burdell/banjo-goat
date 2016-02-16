
'use strict';

var _ = require('underscore');
var SimpleMDE = require('simplemde');
var $ = require('jquery');
var marked = require('marked');
var toMarkdown = require('to-markdown');

require('directives/emojipicker/emojipicker.js');
require('directives/fileupload/fileupload.js');

function communityTextEditor($timeout, localizationService, routingService) {
	var link = function(scope, element, attrs, ngModel) {
		var textarea = element.find('textarea')[0];
		
		var editorCtrl = scope.texteditor;

		var isAutofocus = (editorCtrl.autofocus == "true");
		
		var editorOptions = {
			element: $(element).find('.texteditor__editor')[0],
			autofocus: isAutofocus,
			status: false,
			hideIcons: ['side-by-side', 'preview', 'fullscreen', 'guide', 'image'],
		    renderingConfig: {
		       
		    },
		    spellChecker: localizationService.currentLocale === 'en',
		    placeholder: editorCtrl.placeholder
		};

		var isMinimal = (editorCtrl.minimalEditor == "true"); // unfancy but works
		if (isMinimal) {
			_.extend(editorOptions, {
				toolbar: false
			})
		}

		var editorInstance = new SimpleMDE(editorOptions);
		editorInstance.codemirror.on('changes', function(){
			var rawText = editorInstance.value();
			ngModel.$setViewValue(rawText);
			editorCtrl.ngModel = rawText;
		});

		scope.texteditor.setValue = function(value, appendValue, newLine){
			if (!value) {
				value = '';
			}
			
			var cursorPosition = editorInstance.codemirror.getCursor();

			if (appendValue) {
				var lines = editorInstance.value().split('\n');
				var currentLine = lines[cursorPosition.line];
				var currentCharacter = cursorPosition.ch;

				lines[cursorPosition.line] = currentLine.substring(0, currentCharacter) + value + currentLine.substring(currentCharacter);
				value = lines.join('\n');
				if (newLine) {
					value += '\n\n';
				}
			}

			editorInstance.value(value);
			return cursorPosition;
		}

		scope.texteditor.lineCount = function(){
			return editorInstance.codemirror.lineCount();
		}

		scope.texteditor.setCursor = function(coordinates){
			//by default go to end
			if (!coordinates) {
				coordinates = {
					ch: 0,
					line: editorInstance.codemirror.lineCount()
				}
			}

			editorInstance.codemirror.focus();
			editorInstance.codemirror.setCursor(coordinates);
		}

		var initialValue = editorCtrl.ngModel;
		if (initialValue) {
			var markedDownValue = toMarkdown(initialValue);
			editorCtrl.setValue(markedDownValue, true);
		}
	};

	var controller = function($scope) {
		var ctrl = this;

		$scope.$watch(function(){ return ctrl.ngModel; }, function(value){
			if (!value) {
				ctrl.setValue();
			}
		}, true);

		$scope.$on('texteditor:addQuote', function(event, quotedMessage){
			var quotedValue = quotedMessage.body;
			var isHtml = quotedMessage.format === 'html';

			if (isHtml) {
				quotedValue = toMarkdown(quotedValue);
			}

			var newQuote = _.map(quotedValue.split('\n'), function(line){
				return '> ' + line;
			});

			if (isHtml) {
				newQuote.pop();
				newQuote.shift();
			}

			newQuote = newQuote.join('\n');

			var newValue = '##### ' + quotedMessage.insertUser.login + ':\n' + newQuote;
			if (ctrl.lineCount() > 1) {
				newValue = '\n\n' + newValue;
			}
			ctrl.setValue(newValue, true, true);
			ctrl.setCursor();
		});

		_.extend(ctrl, {
			editorId: 'community-editor-' + $scope.$id,
			editorHeight: ctrl.height | '150',
			markdownOptions: {
				sanitize: true,
				breaks: true
			},
			addEmoji: function(selectedEmoji) {
				var emojiValue = ' :' + selectedEmoji.shortcode + ': ';
				var originalCoordinates = ctrl.setValue(emojiValue, true);
				ctrl.setCursor({ line: originalCoordinates.line, ch: originalCoordinates.ch + emojiValue.length });
			},
			embedPhoto: function(photoData) {
				ctrl.setValue('![](' + photoData.fileUrl + ')', true);
			},
			toggleFloat: function() {
				ctrl.fixedtobottom = !ctrl.fixedtobottom; 
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
        	fixedtobottom: '=',
        	fixedtobottomtoggle: '=',
        	autofocus: '@', // note that autofocus causes the browser to scroll to the textbox
        	fileUpload: '='
        }
    };

    return directive;
}
communityTextEditor.$inject = ['$timeout', 'CommunityLocalizationService', require('services/routing.js')];

angular.module('community.directives')
	.directive('communityTextEditor', communityTextEditor);
	
