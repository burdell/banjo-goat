
'use strict';

var _ = require('underscore');

function communitySort() {
	var link = function(scope, element, attrs) {
	};

	var controller = function() {
		var ctrl = this;

		var sortParam = ctrl.sortParam || 'sortField';

		var modelValues = null;
		if (ctrl.modelValue) {
			modelValues = _.indexBy(ctrl.sortOptions, 'value');
		}

		ctrl.sortValue = ctrl.sortFilter.model(sortParam);

		ctrl.sort = function(){
			var sortModel;

			if (modelValues) {
				sortModel = modelValues[ctrl.sortValue].model 
			} else {
				sortModel = {};
				sortModel[sortParam] = ctrl.sortValue;	
			}

			if (ctrl.preSortFn) {
				ctrl.preSortFn(sortModel);
			}

			ctrl.sortFilter.filter(sortModel, ctrl.sortExclude);

			if (ctrl.onSortFn) {
				ctrl.onSortFn(sortModel);
			}
		};
	};
	controller.$inject = [];

    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/sorter/sorter.html',
        controllerAs: 'sorter',
        bindToController: true,
        restrict: 'E',
        scope: {
        	'preSortFn': '=',
        	'onSortFn': '=',
        	'sortOptions': '=',
        	'sortFilter': '=',
        	'sortExclude': '@',
        	'sortParam': '@',
        	'modelValue': '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communitySort', communitySort);
	
