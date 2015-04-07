(function(_){
	'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {
		};

		var controller = function($scope, filterService, communityApi, utils) {
			//defaults
			this.pageSize = Number(this.pageSize) || 30;
			

			var pageData = {
				limit: this.pageSize,
				offset: 0
			};
			
			var ctrl = this;
			var filterer = this.pagerFn ? this.pagerFn : filterService.getNewFilter();  

			function Page() {
				filterer.filter(pageData).then(function(result){
					ctrl.pagedList = result.content;
				});
			};

			function NextPage (){
				pageData.offset += this.pageSize;
				Page();
			};

			function PreviousPage(){
				pageData.offset -= this.pageSize;
				if (pageData.offset < 0) {
					pageData.offset = 0;
				}
				Page();
			};

			_.extend(ctrl, {
				nextPage: NextPage,
				previousPage: PreviousPage
			});
		};
		controller.$inject = ['$scope', 'CommunityFilterService', 'CommunityApiService'];

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

	angular.module('community.directives')
		.directive('communityPager', communityFilter);
		
}(window._));