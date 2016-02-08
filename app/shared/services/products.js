
'use strict';

var _ = require('underscore');

var products = function($q, nodeService){
	return {
		_productList: null,
		_productsByCategory: null,
		getProductList: function(){
			var service = this;

			if (!this._productList) {
				return nodeService.get().then(function(nodeData) {
					var products = nodeData.getNode(8).children;
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
products.$inject = ['$q', require('services/nodestructure.js')];

var serviceName = 'CommunityProductService';
angular.module('community.services')
	.service(serviceName, products);
module.exports = serviceName;

