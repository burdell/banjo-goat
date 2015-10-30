
'use strict';

function communitySort() {
	var link = function(scope, element, attrs) {
	};

	var controller = function() {
		var ctrl = this;

		var sortParam = ctrl.sortParam || 'sort';

		ctrl.sortValue = ctrl.sortFilter.model(sortParam);
		ctrl.sort = function(){
			var sortModel = {};
			sortModel[sortParam] = ctrl.sortValue;
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
        	'onSortFn': '=',
        	'sortOptions': '=',
        	'sortFilter': '=',
        	'sortExclude': '@',
        	'sortParam': '@'
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communitySort', communitySort);
	
