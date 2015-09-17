(function(_){
	'use strict';
	
	function communityError() {
		var controller = function(errorService) {
			var ctrl = this;

			_.extend(ctrl, {
				errorList: errorService.errorList,
				clearErrors: function() {
					errorService.clearErrors();
				}
			});
		};
		controller.$inject = ['CommunityErrorService'];

	    var directive = {
	        controller: controller,
	        templateUrl: 'directives/error/error.html',
	        controllerAs: 'error',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        }
	    };
	    return directive;
	}

	angular.module('community.directives')
		.directive('communityError', communityError);
		
}(window._));