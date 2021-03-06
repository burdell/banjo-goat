	'use strict';

	var _ = require('underscore');

	
	var nodeStructure = function($q, $rootScope, $stateParams, iconService, apiService, localizationService, routingService, routesProvider){
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
			var exclude = [-1];
			var include = [];

			var discussionTypes = nodeStructureService.DiscussionTypes;
			_.each(nodeCollection, function(node) {
				if (currentNodeName && currentNodeName.toLowerCase() === node.urlCode.toLowerCase()) {
					nodeStructureService.CurrentNode = node;
				}
				
				//set up category nodes
				if (_.indexOf(include, node.id) >= 0 || (node.discussionStyle === 'category' && _.indexOf(exclude, node.id)) < 0) {
					var discussionCategory = node.meta.org;
					var discussionCategoryList = discussionTypes[discussionCategory];
					
					if (discussionCategory === 'broadband' || discussionCategory === 'enterprise') {
						if (!discussionCategoryList) {
							discussionTypes[discussionCategory] = []
						}
						node.iconClass = iconService[node.urlCode];
						discussionTypes[discussionCategory].push(node);
					} else if (discussionCategory === 'legacy') {
						if (!discussionCategoryList) {
							discussionTypes[discussionCategory] = []
						}
						discussionTypes[discussionCategory] = discussionTypes[discussionCategory].concat(node.children);
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
			var currentNode = nodesByUrl[nodeUrl.toLowerCase()] || nodesById[-1];
			nodeStructureService.CurrentNode = currentNode;
		}

		var strings = localizationService.data.core.productCategories;
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
			},
			generateNodeDetailUrl: function(nodeId, topicId, messageId){
				var node = this.getNode(nodeId);
				var route = node.discussionStyle + '.detail';

				var discussionStyle = node.discussionStyle;
				var detailId = routesProvider.detailIds[discussionStyle];

				var routeDetails = {
					nodeId: node.urlCode
				};
				routeDetails[routesProvider.detailIds[discussionStyle]] = topicId;
				
				return routingService.generateUrl(discussionStyle + '.detail', routeDetails, messageId);
			},
			getProductTypeList: function(){
				return [
					{ 
						header: localizationService.data.core.cmuName, 
						list: this.DiscussionTypes.legacy,
						type: 'community' 
					},
					{ 
						header: strings.serviceProviders, 
						list: this.DiscussionTypes.broadband,
						type: 'serviceProviders'
					},
					{ 
						header: strings.enterprise, 
						list: this.DiscussionTypes.enterprise,
						type: 'enterprise' 
					}
				];
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
					return apiService.Core.nodeStructure().then(function(result){
						if (!nodeId) {
							nodeId = $stateParams.nodeId;
						}

						if (!nodeStructureService.NodeStructure) {
							nodeStructureService.NodeStructure = setNodeStructure(nodeId, result);
						}
						return nodeStructureService;
					});
				}
				return $q.when(nodeStructureService);
			}
		}
	};
	nodeStructure.$inject = [
		'$q', 
		'$rootScope', 
		'$stateParams', 
		require('services/icon.js'), 
		require('services/api.js'), 
		'CommunityLocalizationService',
		require('services/routing.js'), 
		require('providers/routes.js')
	];

	var serviceName = 'CommunityNodeService';
	angular.module('community.services')
		.service(serviceName, nodeStructure);
	module.exports = serviceName;

