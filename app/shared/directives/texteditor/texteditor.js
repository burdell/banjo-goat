(function(_){
	'use strict';
	
	function communityTextEditor($timeout) {
		var link = function(scope, element, attrs, ngModel) {
			$timeout(function(){
				console.log(scope.texteditor.editorId);
				var e = element;
				tinymce.init({
					elements: scope.texteditor.editorId,
					mode: 'exact',
					setup: function(editor) {
						// function updateEditor() {
						// 	debugger;
						// 	editor.save();
						// 	ngModel.$setViewValue(element.val())
						// 	if (!scope.$$phase) {
	     //                        scope.$apply();
	     //                    }
						// };

						// editor.on('KeyUp', function(e) {
						// 	updateEditor()
						// });

						// editor.on('ExecCommand', function(e) {
						// 	updateEditor()
						// });
					}
				});
			}, 0)
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
	        	
	        }
	    };

	    return directive;
	}
	communityTextEditor.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityTextEditor', communityTextEditor);
		
}(window._));