(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {
		};

		var controller = function($scope, $parse, filterService, communityApi, utils) {
			//defaults
			this.pageSize = Number(this.pageSize) || 30;
			

			var pageData = {
				limit: this.pageSize,
				offset: 0
			};

			//ugh ... why $parent? 
			var $parent = $scope.$parent;
			var filterer = this.pagerFn ? $parse(this.pagerFn)($parent) : filterService.getNewFilter();  
			
			var pagedListFn = $parse(this.pagedList);
			var page = function(){
				filterer.filter(pageData).then(function(result){
					pagedListFn.assign($parent, result.content);
				});
			};

			this.nextPage = function(){
				pageData.offset += this.pageSize;
				page();
			};

			this.previousPage = function(){
				pageData.offset -= this.pageSize;
				if (pageData.offset < 0) {
					pageData.offset = 0;
				}

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
	        	pagedList: '@',
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