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

			var filterer = this.pagerFn ? this.pagerFn : filterService.getNewFilter();  
			
			var pagerCtrl = this;
			var page = function(){
				filterer.filter(pageData).then(function(result){
					pagerCtrl.pagedList = result.content;
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
	        	allowEnd: '@',
	        	pagedList: '=',
	        	pageSize: '@',
	        	pagerFn: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communityPager', communityFilter);
		
}(window._));