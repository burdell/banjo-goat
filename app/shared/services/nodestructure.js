(function(_) {
	'use strict';
	
	var nodeStructure = function($q, $rootScope, $stateParams, initService, routingService){
		var nodeStructureService;

		function setNodeStructure(currentNodeName, nodeData){
			var service = nodeStructureService;			
			var setParent = function(o) {
				if (!o.children) {
					return;	
				} 

				if (o.urlSlug === currentNodeName) {
					service.CurrentNode = o;
				}

			    if(o.children.length > 1){
			     	_.each(o.children, function(child){
			     		child.parent = o;
			     		setParent(child);
			     	});
			     } 
			};

			if (!nodeData) {
				nodeData = service.NodeStructure;
			}

			setParent(nodeData);
			return nodeData;
		}

		nodeStructureService = {
			NodeStructure: null,
			CurrentNode: null,
			ProductList: null,
			setCurrentSubnode: function(subnodeName){
				var newNode = {
					name: subnodeName,
					parent: this.CurrentNode
				};

				this.CurrentNode = newNode;
			},
			clearCurrentSubnode: function(){
				this.CurrentNode = this.CurrentNode.parent;
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
							nodeId = $stateParams.nodeId
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