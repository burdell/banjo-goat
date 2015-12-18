
'use strict';

var _ = require('underscore');

function showCount() {
	var controller = function() {
	};

	controller.$inject = [];

    var directive = {
        controller: controller,
        templateUrl: 'directives/showcount/showcount.html',
        controllerAs: 'showcount',
        bindToController: true,
        restrict: 'E',
        scope: {
        	'lower': '=',
        	'type': '@',
        	'upper': '=',
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communityShowCount', showCount);
		
