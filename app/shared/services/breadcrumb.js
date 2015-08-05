(function(_) {
	'use strict';
	
	var breadcrumbService = function(nodeServiceWrapper){
		var nodeServiceHolder = null;

		return {
			breadcrumbList: [],
			CurrentBreadcrumb: null,
			getBreadcrumbData: function(nodeId, syncToNodeStructure){
				var breadCrumbList = [];
				var service = this;

				return this.getCurrentBreadcrumb(nodeId, syncToNodeStructure).then(function(currentBreadcrumb){
					var parentNode = nodeServiceHolder.parent(currentBreadcrumb.id);
					while(parentNode) {
						if (!parentNode.invisible) {
							breadCrumbList.unshift(parentNode);
						}
						parentNode = nodeServiceHolder.parent(parentNode.id);
					}
					service.breadcrumbList = breadCrumbList;

					if (service.onDataSet) {
						service.onDataSet();
						service.onDataSet = null;
					}

					return {
						currentBreadcrumb: service.CurrentBreadcrumb,
						breadcrumbList: service.breadcrumbList
					}
				});
			},
			getCurrentBreadcrumb: function(nodeId, syncToNodeStructure){
				var service = this;
				return nodeServiceWrapper.get(nodeId).then(function(nodeService){
					if (!service.CurrentBreadcrumb || syncToNodeStructure) {
						service.CurrentBreadcrumb = nodeService.CurrentNode;
					}
					nodeServiceHolder = nodeService;
					return service.CurrentBreadcrumb;
				});
			},
			setCurrentBreadcrumb: function(subnodeName){
				var service = this;

				function setCrumb() {
					var currentBreadcrumb = service.CurrentBreadcrumb;
					if (currentBreadcrumb) {
						service.breadcrumbList.push(currentBreadcrumb);
					}
					service.CurrentBreadcrumb = {
						name: subnodeName,
						parent: currentBreadcrumb
					};
				}
				
				setCrumb();
				service.onDataSet = setCrumb;
				
			},
			clearCurrentBreadcrumb: function(){
				this.onDataSet = null;
				this.breadcrumbList.pop();
				this.CurrentBreadcrumb = this.CurrentBreadcrumb.parent;
			}
		};
	};
	breadcrumbService.$inject = ['CommunityNodeService'];

	angular.module('community.services')
		.service('CommunityBreadcrumbService', breadcrumbService);

}(window._));