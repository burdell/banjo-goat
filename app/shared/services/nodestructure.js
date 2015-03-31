(function(_) {
	'use strict';
	
	var nodeStructure = function($stateParams){
		return {
			NodeStructure: null,
			CurrentNode: null,
			setNodeStructure: function(nodeData){
				var service = this;
				var setParent = function(o){
				     if(o.children.length > 1){
				     	_.each(o.children, function(child){
				     		child.parent = o;
				     		setParent(child);
				     	});
				     } else if (o.urlSlug === $stateParams.nodeId) {
				     	service.CurrentNode = o;
				     }
				};

				setParent(nodeData);
				this.NodeStructure = nodeData;
			}
		};
	};
	nodeStructure.$inject = ['$stateParams'];

	angular.module('community.shared')
		.service('CommunityNodeService', nodeStructure);

}(window._));