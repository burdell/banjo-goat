(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {

		};

		var controller = function($scope, utils) {
			//ui model
			this.filter = {};

			var exclude = this.filterExclude ? utils.splitCsv(this.filterExclude) : null;
			var filterCtrl = this;
			
			//ugh, why $parent?
			$scope.$parent.$watch('fm.filter', function(newValue, oldValue){
				if (newValue !== oldValue) {
					filterCtrl.filterFn.filter(newValue, exclude).then(function(result){
						filterCtrl.filterList = result.content;
					});
				}
			}, true);

		};
		controller.$inject = ['$scope', 'CommunityUtilsService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'fm',
	        bindToController: true,
	        restrict: 'A',
	        scope: {
	        	filterExclude: '@',
	        	filterFn: '=',
	        	filterList: '=communityFilter'
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityFilter', communityFilter);
		
}(window._));