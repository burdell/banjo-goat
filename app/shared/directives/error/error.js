
'use strict';

var _ = require('underscore');

function communityError() {
	var controller = function($scope, errorService) {
		var ctrl = this;

		$scope.$on('$stateChangeSuccess', function(){
			ctrl.clearErrors();
		});

		_.extend(ctrl, {
			errorList: errorService.errorList,
			clearErrors: function() {
				errorService.clearErrors();
			}
		});
	};
	controller.$inject = ['$scope', 'CommunityErrorService'];

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
	
