
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

		var modelFn = this.loadFilter.model;
		this.loadFilter.set({ 
			onFilter: function(result) {
				if (result) {
					pageNumber = modelFn('page') || 1;
					ctrl.listMetadata.hasMore = !(pageNumber === result.totalPages);
				}
			}
		});
		
		_.extend(ctrl, {
			load: function(){
				ctrl.isLoading = true;

				this.loadFilter.filter({
					page: pageNumber + 1
				}).then(function(result) {
					if (!ctrl.noLoadFn) {
						if (ctrl.onLoadFn) {
							ctrl.onLoadFn(result.content);
						} else {
							ctrl.listModel = ctrl.listModel.concat(result.content);
						}
					}
					
					ctrl.isLoading = false;
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
        	onLoadFn: '=',
        	noLoadFn: '='
        }
    };

    return directive;
}
communityloadMore.$inject = ['$window'];

angular.module('community.directives')
	.directive('communityLoadMore', communityloadMore);
