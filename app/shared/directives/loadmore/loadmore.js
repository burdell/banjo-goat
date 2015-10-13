
'use strict';

var _ = require('underscore');
var $ = require('jquery');

function communityloadMore($window) {
	function link(scope, element, attrs) {
	    if (scope.loadmore.infiniteScroll) {
			var windowEl = $(window);
			var documentEl = $(document);
			windowEl.bind('scroll', function() {
				if(scope.loadmore.listMetadata.hasMore && !scope.loadmore.isLoading && (windowEl.scrollTop() == documentEl.height() - windowEl.height())){
					scope.loadmore.load();
				}
			});
		}
	}

	function controller() {	
		var ctrl = this;
		
		var pageNumber = 1;
		
		_.extend(ctrl, {
			load: function(){
				ctrl.isLoading = true;

				this.loadFilter.filter({
					page: pageNumber + 1
				}).then(function(result) {
					pageNumber += 1;

					if (ctrl.onLoadFn) {
						ctrl.onLoadFn(result.content);
					} else {
						ctrl.listModel = ctrl.listModel.concat(result.content);
					}
					
					ctrl.isLoading = false;
					ctrl.listMetadata.hasMore = !(pageNumber === result.totalPages);
				});
			},
			listMetadata: {
				hasMore: !ctrl.listModel.last
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
