(function(_) {
	'use strict';

	var initialize = function($q, communityApi, currentUser){
		var _initFn = null;

		function initialization(options) {
			var deferred = $q.defer();
			_initFn = deferred.promise;

			var authCheck = communityApi.Users.authentication();
			var nodeStructure = communityApi.Core.nodeStructure();

			return $q.all([ authCheck, nodeStructure ]).then(function(result){
				deferred.resolve();
				_initFn = null;
				
				return {
					auth: result[0],
					node: result[1]
				}
			});
		}

		return {
			initialize: function(options){
				return _initFn ? _initFn : initialization(options);
			}
		};
	};
	initialize.$inject = ['$q', 'CommunityApiService' ];

	angular.module('community.services')
		.service('CommunityInitializeService', initialize);

}(window._));