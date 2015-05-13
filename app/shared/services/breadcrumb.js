(function(_) {
	'use strict';
	
	var breadcrumbService = function(nodeService){
		return {
			breadcrumbList: [],
			CurrentBreadcrumb: null,
			getBreadcrumbList: function(){
				var breadCrumbList = [];

				var currentBreadcrumb = this.getCurrentBreadcrumb();
				var parentNode = currentBreadcrumb.parent;
				while(parentNode) {
					if (!parentNode.invisible) {
						breadCrumbList.unshift(parentNode);
					}
					parentNode = parentNode.parent;
				}

				return breadCrumbList;
			},
			getCurrentBreadcrumb: function(){
				if (!this.CurrentBreadcrumb) {
					this.CurrentBreadcrumb = nodeService.CurrentNode;
				}

				return this.CurrentBreadcrumb;
			},
			setCurrentBreadcrumb: function(subnodeName){
				var newNode = {
					name: subnodeName,
					parent: this.getCurrentBreadcrumb()
				};

				this.CurrentBreadcrumb = newNode;
			},
			clearCurrentBreadcrumb: function(){
				this.CurrentBreadcrumb = this.CurrentBreadcrumb.parent;
			}
		};
	};
	breadcrumbService.$inject = ['CommunityNodeService'];

	angular.module('community.services')
		.service('CommunityBreadcrumbService', breadcrumbService);

}(window._));