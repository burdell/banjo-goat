(function(_) {
	'use strict';
	
	var products = function(nodeService){
		return {
			_productList: null,
			getProductList: function(){
				if (!this._productList) {
					var products = _.where(nodeService.NodeStructure.children, { name: 'Products' })[0].children;
					this._productList = _.map(products, function(product){
						return { 
							href: product.href, 
							id: product.id, 
							name: product.name 
						};
					})
				}

				return this._productList;
			},
			productIconClasses: {
				
			}
		};
	};
	products.$inject = ['CommunityNodeService'];

	angular.module('community.services')
		.service('CommunityProductService', products);

}(window._));