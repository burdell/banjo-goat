(function(_) {
	'use strict';
	
	var nodeStructure = function($q, $rootScope, $stateParams, initService, routingService){
		var nodeStructureService;
		var nodesById = {};
		var nodesByUrl = {};

		function setNodeStructure(currentNodeName, nodeData){
			var nodeCollection = nodeData;

			nodesById = _.groupBy(nodeCollection, function(node){
				return node.id
			});
			
			_.each(nodeCollection, function(node) {
				nodesById[node.id] = node;
				nodesByUrl[node.urlCode.toLowerCase()] = node;
			});

			//hard coded includes/excludes :/ 
			var exclude = [-1, 75, 141];
			var include = [30, 20, 42];
			var discussionTypes = nodeStructureService.DiscussionTypes;
			_.each(nodeCollection, function(node) {
				if (currentNodeName.toLowerCase() === node.urlCode.toLowerCase()) {
					nodeStructureService.CurrentNode = node;
				}

				if (_.indexOf(include, node.id) >= 0 || (node.discussionType === 'category' && _.indexOf(exclude, node.id)) < 0) {
					var discussionCategory = node.meta.org;
					var discussionCategoryList = discussionTypes[discussionCategory];

					if (discussionCategory === 'broadband' || discussionCategory === 'enterprise' || (discussionCategory === 'general')) {
						if (!discussionCategoryList) {
							discussionTypes[discussionCategory] = []
						}
						discussionTypes[discussionCategory].push(node);
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

		function setCurrentNode(nodeUrl) {
			if (!nodeUrl) {
				return;
			}


			nodeStructureService.CurrentNode = nodesByUrl[nodeUrl.toLowerCase()];
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
				return nodesById[nodeId];
			},
			parent: function(childNodeId) {
				var childNode = this.getNode(childNodeId);
				return childNode ? this.getNode(childNode.parentCategoryId) : null;
			}
		};

		$rootScope.$on('$stateChangeSuccess', function(event, currentState, currentParams){
			//if there is no nodeid, assume it's a landing page and use current area name
			var nodeId = currentParams.nodeId ? currentParams.nodeId : routingService.getCurrentArea();
			setCurrentNode(nodeId);	
		});

		return {
			get: function(nodeId){
				if (!nodeStructureService.NodeStructure) {
					return initService.initialize().then(function(result){
						if (!nodeId) {
							nodeId = $stateParams.nodeId;
						}

						if (!nodeStructureService.NodeStructure) {
							nodeStructureService.NodeStructure = setNodeStructure(nodeId, result.node);
						}
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