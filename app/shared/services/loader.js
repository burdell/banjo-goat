
'use strict';

var products = function(){
	return {
		showBaseLoader: true
	};
};

var serviceName = 'CommunityLoaderService';
angular.module('community.services')
	.service(serviceName, products);
module.exports = serviceName;

