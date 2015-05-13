(function(_, tinymce, $){
	'use strict';
	
	function communityTextEditor($timeout) {
		var link = function(scope, element, attrs, ngModel) {
			$timeout(function(){
				var textElement = $(element).find('#' + scope.texteditor.editorId);
				var editorInstance = null;

				ngModel.$render = function(){
					if (!editorInstance) {
						editorInstance = tinymce.get(scope.texteditor.editorId);
					}

					editorInstance.setContent(ngModel.$viewValue || '');
				};
				
				tinymce.init({
					height: scope.texteditor.height || 150,
					elements: scope.texteditor.editorId,
					mode: 'exact',
					menubar: false,
					preview_styles: false,
					browser_spellcheck: true,
					toolbar: scope.texteditor.minimalEditor === 'true' ? false : undefined,
					setup: function(editor) {
						function updateModel() {
							editor.save();

							ngModel.$setViewValue(textElement.val());
							if (!scope.$$phase) {
	                            scope.$apply();
	                        }
						}

						editor.on('KeyUp', function(e) {
							updateModel();
						});

						editor.on('ExecCommand', function(e) {
							updateModel();
						});

						editor.on('init', function(){
							ngModel.$render();
						});
					},
					init_instance_callback: function(){
						$(element).find('.mce-path').css('visibility', 'hidden');
					}
				});
			}, 0);
		};

		var controller = function($scope) {
			var ctrl = this;
			_.extend(ctrl, {
				editorId: 'community-editor-' + $scope.$id
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
	        	minimalEditor: '@'
	        }
	    };

	    return directive;
	}
	communityTextEditor.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityTextEditor', communityTextEditor);
		
}(window._, window.tinymce, window.jQuery));