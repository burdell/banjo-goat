(function(_){
	'use strict';
	
	function communityTextEditor($timeout) {
		var link = function(scope, element, attrs) {
			$timeout(function(){
				var e = element;
				tinymce.init({
					selector: '.' + scope.texteditor.className,
					menubar: false
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
	        }
	    };

	    return directive;
	}
	communityTextEditor.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityTextEditor', communityTextEditor);
		
}(window._));