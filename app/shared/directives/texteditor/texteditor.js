(function(_){
	'use strict';
	
	function communityTextEditor($timeout) {
		var link = function(scope, element, attrs) {
			TINYMCE_DEFAULT_CONFIG = {
			   'plugins': "fullscreen,paste,autoresize",
			   'theme': "advanced",
			   'theme_advanced_buttons1' : "bold,italic,strikethrough,bullist,numlistseparator,undo,redo,separator,link,unlink,image"\
			                               ",separator,cleanup,code,removeformat,charmap,"\
			                               "fullscreen,paste",
			   'theme_advanced_buttons2' : "",
			   'theme_advanced_buttons3' : "",
			};

			$timeout(function(){
				var e = element;
				tinymce.init({
					selector: '.' + scope.texteditor.className,
					setup: function(editor) {
						editor.on('change', function(e) {
						})
					}
				});
			}, 0)
		};

		var controller = function($scope) {
			var ctrl = this;
			_.extend(ctrl, {
				className: 'community-editor-' + $scope.$id
			});

		};
		controller.$inject = ['$scope'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/texteditor/texteditor.html',
	        controllerAs: 'texteditor',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	ngModel: '='
	        }
	    };

	    return directive;
	}
	communityTextEditor.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityTextEditor', communityTextEditor);
		
}(window._));