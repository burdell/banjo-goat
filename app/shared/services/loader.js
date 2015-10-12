
'use strict';

var products = function(){
	return {
		showBaseLoader: true
	};
};

angular.module('community.services')
	.service('CommunityLoaderService', products);

