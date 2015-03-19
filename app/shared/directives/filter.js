(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {
		    scope.setFilter(attrs);
		};

		var controller = function($scope, $parse, filterService, communityApi, utils) {
			var filterer = null;
			var filterOptions = {};
			var filteredListAttribute = null;
			
			//ui model
			this.filter = filterOptions;

			$scope.setFilter = function(attrs) {
				var apiCall = attrs.communityFilter;
				var apiArgs = attrs.apiArgs;

				filteredListAttribute = attrs.filterList;
				filterer = attrs.filterFn ? $parse(attrs.filterFn)($scope) : filterService.getNewFilter(); 

				var filterFn = $parse(apiCall)(communityApi);
				var filterArgs = utils.splitCsv(apiArgs);

				if (filterArgs) {
					filterArgs = _.map(filterArgs, function(arg){
						return $parse(arg)($scope);
					});
				}	

				filterer.set(filterFn, filterArgs);
			};

			$scope.$watch('fm.filter', function(newValue, oldValue){
				if (newValue !== oldValue) {
					filterer.filter(newValue).then(function(result){
						$parse(filteredListAttribute).assign($scope, result.content);
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
	        scope: true
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communityFilter', communityFilter);
		
}(window._));