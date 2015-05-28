(function(_){
	'use strict';

	function communityloadMore() {
		function link(scope, element, attrs) {
		    
		}

		function controller() {	
			var ctrl = this;
			ctrl.listMetadata.offset = 0;

			_.extend(ctrl, {
				load: function(){
					var metaData = this.listMetadata;
					
					metaData.offset += metaData.limit;
					this.loadFilter.filter({
						limit: this.listMetadata.limit,
						offset: this.listMetadata.offset
					}).then(function(result) {
						ctrl.listModel = ctrl.listModel.concat(result.collection);
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
	        restrict: 'E',
	        controllerAs: 'loadmore',
	        bindToController: true,
	        replace: true,
	        scope: {
	        	listModel: '=',
	        	listMetadata: '=',
	        	loadText: '@',
	        	loadFilter: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityLoadMore', communityloadMore);
}(window._));