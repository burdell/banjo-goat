(function(_) {
	'use strict';
	
	var breadcrumbService = function(nodeServiceWrapper){
		return {
			breadcrumbList: [],
			CurrentBreadcrumb: null,
			getBreadcrumbData: function(){
				var breadCrumbList = [];

				return this.getCurrentBreadcrumb().then(function(currentBreadcrumb){
					var parentNode = currentBreadcrumb.parent;
					while(parentNode) {
						if (!parentNode.invisible) {
							breadCrumbList.unshift(parentNode);
						}
						parentNode = parentNode.parent;
					}

					return { 
						currentBreadcrumb: currentBreadcrumb,
						breadcrumbList: breadCrumbList
					};
				});
			},
			getCurrentBreadcrumb: function(){
				var service = this;
				return nodeServiceWrapper.get().then(function(nodeService){
					if (!service.CurrentBreadcrumb) {
						service.CurrentBreadcrumb = nodeService.CurrentNode;
					}

					return service.CurrentBreadcrumb;
				});
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
			},
			syncToNodeStructure: function(){
				this.CurrentBreadcrumb = nodeService.CurrentNode;
			}
		};
	};
	breadcrumbService.$inject = ['CommunityNodeService'];

	angular.module('community.services')
		.service('CommunityBreadcrumbService', breadcrumbService);

}(window._));