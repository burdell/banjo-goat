(function(_){
	'use strict';
	
	var extractKey = function(){
		return function(objectList, key){
			var foundObject = _.findWhere(objectList, { key: key });
			return (foundObject ? foundObject.value : '');
		};
	};

	angular.module('community.filters')
		.filter('extractKey', extractKey);

}(window._));