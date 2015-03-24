(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {

		};

		var controller = function($scope, $parse, filterService, communityApi, utils) {
			var $parent = $scope.$parent;

			var filterer = $parse(this.filterFn)($parent);
			var filterOptions = {};
			var filteredListAttribute = this.filterList;
			
			//ui model
			this.filter = filterOptions;

			$parent.$watch('fm.filter', function(newValue, oldValue){
				if (newValue !== oldValue) {
					filterer.filter(newValue).then(function(result){
						$parse(filteredListAttribute).assign($parent, result.content);
					});
				}
			}, true);
		};
		controller.$inject = ['$scope', '$parse', 'CommunityFilterService', 'CommunityApiService', 'CommunityUtilsService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'fm',
	        bindToController: true,
	        restrict: 'A',
	        scope: {
	        	filterList: '@communityFilter',
	        	filterFn: '@'
	        }
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communityFilter', communityFilter);
		
}(window._));