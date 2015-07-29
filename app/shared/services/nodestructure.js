(function(_) {
	'use strict';
	
	var nodeStructure = function($q, $stateParams, initService){
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

		return {
			get: function(){
				if (!nodeStructureService.NodeStructure) {
					return initService.initialize().then(function(result){
						//TODO $stateParama
						nodeStructureService.NodeStructure = setNodeStructure($stateParams.nodeId, result.node);

						return nodeStructureService;
					});
				}

				return $q.when(nodeStructureService);
			}
		}
	};
	nodeStructure.$inject = ['$q', '$stateParams', 'CommunityInitializeService'];

	angular.module('community.services')
		.service('CommunityNodeService', nodeStructure);

}(window._));