(function(_) {
	'use strict';
	
	var nodeStructure = function(){
		return {
			NodeStructure: null,
			CurrentNode: null,
			setNodeStructure: function(currentNodeName){
				var nodeData = window.nodeStructure[0];
				var service = this;
				var setParent = function(o) {
					if (!o.children) {
						return;	
					} 

				     if(o.children.length > 1){
				     	_.each(o.children, function(child){
				     		child.parent = o;
				     		setParent(child);
				     	});
				     } else if (o.urlSlug === currentNodeName) {
				     	service.CurrentNode = o;
				     }
				};

				setParent(nodeData);
				this.NodeStructure = nodeData;
			
				return nodeData;
			}
		};
	};
	nodeStructure.$inject = [];

	angular.module('community.services')
		.service('CommunityNodeService', nodeStructure);

}(window._));