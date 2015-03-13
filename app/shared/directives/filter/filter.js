(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {
		    scope.setFilter(attrs.communityFilter, attrs.filterList, attrs.apiArgs);
		};

		var controller = function($scope, $parse, filterService, communityApi, utils) {
			var filterer = filterService.getNewFilter();
			var filterOptions = {};

			//ui model
			this.filter = filterOptions;

			$scope.setFilter = function(apiCall, filterList, apiArgs) {
				var filterFn = $parse(apiCall)(communityApi);
				var filteredList = $parse(filterList)($scope);
				var filterArgs = utils.splitCsv(apiArgs);

				if (filterArgs) {
					filterArgs = _.map(filterArgs, function(arg){
						return $parse(arg)($scope);
					});
				}

				filterer.set(filterOptions, filterFn, filterArgs, filteredList);
			};

			$scope.$watch('fm.filter', function(){
				filterer.filter();
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