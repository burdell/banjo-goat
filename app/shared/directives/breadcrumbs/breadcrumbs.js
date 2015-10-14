
'use strict';

require('services/breadcrumb.js');
require('services/routing.js');

require('directives/arealinkhandler/arealinkhandler.js');

var _ = require('underscore');

function communityBreadcrumbs() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(breadcrumbService, routingService) {
			breadcrumbService.getBreadcrumbData(this.nodeId, true);

			var ctrl = this;
			_.extend(ctrl, {
				currentBreadcrumb: function(){
					var currentBreadcrumb = breadcrumbService.CurrentBreadcrumb;
					return currentBreadcrumb && currentBreadcrumb.name;
				},
				breadcrumbList: function(){
					return breadcrumbService.breadcrumbList;
				}
			});
		};
		controller.$inject = ['CommunityBreadcrumbService', 'CommunityRoutingService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/breadcrumbs/breadcrumbs.html',
	        controllerAs: 'breadcrumbs',
	        bindToController: true,
	        replace: true,
	        restrict: 'E',
	        scope: {
	        	nodeId: '@'
	        }
	    };

	    return directive;
	}

angular.module('community.directives')
	.directive('communityBreadcrumbs', communityBreadcrumbs);
	
