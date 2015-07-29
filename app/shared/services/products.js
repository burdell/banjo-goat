(function(_) {
	'use strict';
	
	var products = function($q, nodeService){
		return {
			_productList: null,
			getProductList: function(){
				var service = this;

				if (!this._productList) {
					return nodeService.get().then(function(nodeData) {
						var products = _.where(nodeData.NodeStructure.children, { name: 'Products' })[0].children;
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
			},
			productIconClasses: {
				
			}
		};
	};
	products.$inject = ['$q', 'CommunityNodeService'];

	angular.module('community.services')
		.service('CommunityProductService', products);

}(window._));