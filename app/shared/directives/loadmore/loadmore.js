(function(_){
	'use strict';

	function communityloadMore($window) {
		function link(scope, element, attrs) {
		    if (scope.loadmore.infiniteScroll) {
				var windowEl = $(window);
				var documentEl = $(document);
				windowEl.bind('scroll', function() {
					if(!scope.loadmore.isLoading && (windowEl.scrollTop() == documentEl.height() - windowEl.height())){
						scope.loadmore.load();
					}
				});
			}
		}

		function controller() {	
			var ctrl = this;
			ctrl.listMetadata.offset = 0;

			_.extend(ctrl, {
				load: function(){
					var metaData = this.listMetadata;
					metaData.offset += metaData.limit;
					ctrl.isLoading = true;

					this.loadFilter.filter({
						limit: this.listMetadata.limit,
						offset: this.listMetadata.offset
					}).then(function(result) {
						if (ctrl.onLoadFn) {
							ctrl.onLoadFn(result.collection);
						} else {
							ctrl.listModel = ctrl.listModel.concat(result.collection);
						}
						ctrl.isLoading = false;
						ctrl.listMetadata.hasMore = result.next.hasMore;
					});
				}
			});
		}
		controller.$inject = [];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/loadmore/loadmore.html',
	        restrict: 'E ',
	        controllerAs: 'loadmore',
	        bindToController: true,
	        replace: true,
	        scope: {
	        	listModel: '=',
	        	listMetadata: '=',
	        	loadText: '@',
	        	loadFilter: '=',
	        	infiniteScroll: '=',
	        	onLoadFn: '='
	        }
	    };

	    return directive;
	}
	communityloadMore.$inject = ['$window'];

	angular.module('community.directives')
		.directive('communityLoadMore', communityloadMore);
}(window._));