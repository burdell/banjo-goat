(function(_) {
	'use strict';
	
	var products = function($q, iconService, nodeService){
		return {
			_productList: null,
			getProductList: function(){
				var service = this;

				if (!this._productList) {
					return nodeService.get().then(function(nodeData) {
						var products = nodeData.getNode(75).children;
						service._productList = _.map(products, function(product){
							return { 
								href: product.href, 
								id: product.id, 
								name: product.name 
							};
						});

						return service._productList;
					});
				}

				return $q.when(this._productList);
			}
		};
	};
	products.$inject = ['$q', 'CommunityNodeService', 'CommunityIconService'];

	angular.module('community.services')
		.service('CommunityProductService', products);

}(window._));