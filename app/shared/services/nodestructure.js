	'use strict';

	require('services/icon.js');
	require('services/initialize.js');
	require('services/routing.js');

	var _ = require('underscore');

	
	var nodeStructure = function($q, $rootScope, $stateParams, iconService, initService, routingService){
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
			var exclude = [-1, 75];
			var include = [30, 20, 42, 43, 83];

			var discussionTypes = nodeStructureService.DiscussionTypes;
			_.each(nodeCollection, function(node) {
				if (currentNodeName && currentNodeName.toLowerCase() === node.urlCode.toLowerCase()) {
					nodeStructureService.CurrentNode = node;
				}
				
				//set up category nodes
				if (_.indexOf(include, node.id) >= 0 || (node.discussionStyle === 'category' && _.indexOf(exclude, node.id)) < 0) {
					var discussionCategory = node.meta.org;
					var discussionCategoryList = discussionTypes[discussionCategory];
					
					if (discussionCategory === 'broadband' || discussionCategory === 'enterprise' || (discussionCategory === 'general')) {
						if (!discussionCategoryList) {
							discussionTypes[discussionCategory] = []
						}
						node.iconClass = iconService[node.urlCode];
						discussionTypes[discussionCategory].push(node);
					}
				}

				//populate children of category nodes
				if (!nodeStructureService.NodeStructure && node.parentId) {
					var parentNode = nodeStructureService.getNode(node.parentId);
					if (!parentNode.discussionStyles) {
						parentNode.discussionStyles = {};
					}

					var childDiscussionStyle = node.discussionStyle;
					if (parentNode && childDiscussionStyle !== 'qa' && childDiscussionStyle !== 'bugs') {
						if (!parentNode.children) {
							parentNode.children = [];
						}
						parentNode.discussionStyles[childDiscussionStyle] = true;
						parentNode.children.push(node);
					}
				}
			});
			
			var rootNode = nodeStructureService.getNode(-1);
			if (rootNode && !rootNode.href) {
				rootNode.href = routingService.generateUrl('feed');
			}

			if (!nodeStructureService.CurrentNode) {
				nodeStructureService.CurrentNode = rootNode;
			}
			
			return rootNode
		}

		function setCurrentNode(nodeUrl) {
			if (!nodeUrl) {
				return;
			}

			//set node to base if the node url isn't valid (used for dealing with pages that arent nodes...like announcements landing page)
			var currentNode = nodesByUrl[nodeUrl.toLowerCase()] || nodesByUrl['community'];
			nodeStructureService.CurrentNode = currentNode;
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
				if (_.isString(nodeId)) {
					return nodesByUrl[nodeId.toLowerCase()];
				} 

				return nodesById[nodeId];
			},
			parent: function(childNodeId) {
				var childNode = this.getNode(childNodeId);
				return childNode && childNode.id !== -1 ? this.getNode(childNode.parentId) : null;
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
	nodeStructure.$inject = ['$q', '$rootScope', '$stateParams', 'CommunityIconService', 'CommunityInitializeService', 'CommunityRoutingService'];

	var serviceName = 'CommunityNodeService';
	angular.module('community.services')
		.service(serviceName, nodeStructure);
	module.exports = serviceName;

