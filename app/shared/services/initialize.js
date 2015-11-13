
'use strict';

var initialize = function($q, communityApi, currentUser){
	var _initFn = null;

	function initialization(options) {
		var deferred = $q.defer();
		
		var authCheck = communityApi.Users.authentication();
		var nodeStructure = communityApi.Core.nodeStructure();

		_initFn = $q.all([ authCheck, nodeStructure ]).then(function(result){
			deferred.resolve();
			_initFn = null;
			
			return {
				auth: result[0],
				node: result[1]
			}
		});

		return _initFn;
	}

	return {
		initialize: function(options){
			return _initFn ? _initFn : initialization(options);
		}
	};
};
initialize.$inject = ['$q', require('shared/services/api.js')];

var serviceName = 'CommunityInitializeService';
angular.module('community.services')
	.service(serviceName, initialize);
module.exports = serviceName;
