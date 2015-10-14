'use strict';

module.exports = function(moduleName){
	require('angular').module(moduleName, []);	

	return moduleName;
};
