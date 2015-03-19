(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {
		};

		var controller = function($scope, $parse, filterService, communityApi, utils) {
			//defaults
			this.pageSize = Number(this.pageSize) || 30;
			

			var pageData = {

			};

			//ugh ... why $parent? 
			var filterer = this.pagerFn ? $parse(this.pagerFn)($scope.$parent) : filterService.getNewFilter();  
			
			function page(){
				filterer.filter(pageData).then(function(){
					debugger;
				});
			} 
			this.nextPage = function(){
				page();
			};

			this.previousPage = function(){
				page();
			};
		};
		controller.$inject = ['$scope', '$parse', 'CommunityFilterService', 'CommunityApiService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/pager/pager.html',
	        controllerAs: 'pager',
	        bindToController: true,
	        restrict: 'AE',
	        scope: {
	        	pageSize: '@',
	        	allowEnd: '@',
	        	pagerFn: '@'
	        }
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communityPager', communityFilter);
		
}(window._));