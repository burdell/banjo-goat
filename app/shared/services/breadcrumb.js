(function(_) {
	'use strict';
	
	var breadcrumbService = function(nodeServiceWrapper, routingService){
		var nodeServiceHolder = null;

		function setNodeUrl(node) {
			if (!node || node.href) {
				return;
			}

			node.href = routingService.generateUrl(node.discussionStyle + '.list', { nodeId: node.urlCode });
		}

		var PRODUCT_NODE = 75;
		var UBNT_NODE = 569;
		var OTHER_PRODUCTS_NODE = 121;

		return {
			breadcrumbList: [],
			CurrentBreadcrumb: null,
			getBreadcrumbData: function(nodeId, syncToNodeStructure){
				var breadCrumbList = [];
				var service = this;

				return this.getCurrentBreadcrumb(nodeId, syncToNodeStructure).then(function(currentBreadcrumb){
					var parentNode = nodeServiceHolder.parent(currentBreadcrumb.id);
					while(parentNode) {
						//hide the 'products' abnd 'ubnt' node

						if (parentNode.id !== PRODUCT_NODE && parentNode.id !== UBNT_NODE && parentNode.id !== OTHER_PRODUCTS_NODE) {
							setNodeUrl(parentNode);
							breadCrumbList.unshift(parentNode);
						}

						//if node is a product, set url to landing page
						if (parentNode.parentId === PRODUCT_NODE) {
							parentNode.href = routingService.generateUrl('hub', { nodeId: parentNode.urlCode });
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
						setNodeUrl(service.CurrentBreadcrumb);
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
	breadcrumbService.$inject = ['CommunityNodeService', 'CommunityRoutingService'];

	angular.module('community.services')
		.service('CommunityBreadcrumbService', breadcrumbService);

}(window._));