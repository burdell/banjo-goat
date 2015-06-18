(function(_) {
	'use strict';
	
	var nodeStructure = function(){
		return {
			NodeStructure: null,
			CurrentNode: null,
			ProductList: null,
			setNodeStructure: function(currentNodeName){
				var nodeData = window.nodeStructure[0];
				var service = this;

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
				this.NodeStructure = nodeData;
			
				return nodeData;
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
			}
		};
	};
	nodeStructure.$inject = [];

	angular.module('community.services')
		.service('CommunityNodeService', nodeStructure);

}(window._));