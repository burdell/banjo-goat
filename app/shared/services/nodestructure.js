(function(_) {
	'use strict';
	
	var nodeStructure = function($q, $rootScope, $stateParams, initService, routingService){
		var nodeStructureService;
		var nodesById = {};

		function setNodeStructure(currentNodeName, nodeData){
			var nodeCollection = nodeData;

			nodesById = _.groupBy(nodeCollection, function(node){
				return node.id
			});

			var discussionTypes = nodeStructureService.DiscussionTypes;
			_.each(nodeCollection, function(node) {
				if (currentNodeName.toLowerCase() === node.urlCode.toLowerCase()) {
					nodeStructureService.CurrentNode = node;
				}


				if (node.discussionType === 'category' && node.id > 0) {
					var discussionCategory = node.meta.org;
					var discussionCategoryList = discussionTypes[discussionCategory];

					//these work directly from the node structure, so just throw them in the right bucket ╰( ⁰ ਊ ⁰ )━☆ﾟ.*･｡ﾟ
					if (discussionCategory === 'broadband' || discussionCategory === 'enterprise') {
						if (!discussionCategoryList) {
							discussionTypes[discussionCategory] = []
						}
						discussionTypes[discussionCategory].push(node);
					} else {
						//now the others (ﾉಠдಠ)ﾉ︵┻━┻

					}
				}

				if (!nodeStructureService.NodeStructure && node.parentCategoryId) {
					var parentNode = nodeStructureService.getNode(node.parentCategoryId);
					if (parentNode) {
						if (!parentNode.children) {
							parentNode.children = [];
						}
						parentNode.children.push(node);
					}
				}
			});
			
			var rootNode = nodeStructureService.getNode(-1);
			if (rootNode && !rootNode.href) {
				rootNode.href = routingService.generateUrl('directory');
			}
			
			return rootNode
		}

		nodeStructureService = {
			NodeStructure: null,
			CurrentNode: null,
			ProductList: null,
			DiscussionTypes: {
			},
			setCurrentSubnode: function(subnodeName){
				var newNode = {
					name: subnodeName,
					parent: this.CurrentNode
				};

				this.CurrentNode = newNode;
			},
			clearCurrentSubnode: function(){
				this.CurrentNode = this.CurrentNode.parent;
			},
			getNode: function(nodeId) {
				var node = nodesById[nodeId];
				return node && node[0];
			},
			parent: function(childNodeId) {
				var childNode = this.getNode(childNodeId);
				return childNode ? this.getNode(childNode.parentCategoryId) : null;
			}
		};

		$rootScope.$on('$stateChangeSuccess', function(event, currentState, currentParams){
			//if there is no nodeid, assume it's a landing page and use current area name
			var nodeId = currentParams.nodeId ? currentParams.nodeId : routingService.getCurrentArea();
			setNodeStructure(nodeId);	
		});

		return {
			get: function(nodeId){
				if (!nodeStructureService.NodeStructure) {
					return initService.initialize().then(function(result){
						if (!nodeId) {
							nodeId = $stateParams.nodeId;
						}
						nodeStructureService.NodeStructure = setNodeStructure(nodeId, result.node);
						return nodeStructureService;
					});
				}
				return $q.when(nodeStructureService);
			}
		}
	};
	nodeStructure.$inject = ['$q', '$rootScope', '$stateParams', 'CommunityInitializeService', 'CommunityRoutingService'];

	angular.module('community.services')
		.service('CommunityNodeService', nodeStructure);

}(window._));