(function(){
	'use strict';
	
	var communityApiService = function($http){
		function goToApi(url, verb, data){
			if (_.isUndefined(verb)) {
				verb = 'GET';
			}

			var params = null;
			var payload = null;

			if (verb === 'GET') {
				params = data;
			} else {
				payload = data;
			}

			return $http({
				method: verb,
				url: baseApiUrl + url,
				params: params,
				data: payload
			}).then(function(result){
				return result.data.data;
			});
		}
		var baseApiUrl = 'http://private-anon-7162f4b8c-uvan2apicomm.apiary-mock.com';

		var service = {
			Message: function(){
				return {
					search: function(searchString, searchOptions){
						var params = _.extend({ q: searchString }, searchOptions);
						goToApi('/messages/search', 'GET', params);
					}
				};
			},
			Node: function(nodeId){
				var nodeUrl = '/nodes/' + nodeId;
				return {
					messages: function(data, verb){
						return goToApi(nodeUrl + '/messages', verb, data);
					},
					stats: function(data){
						return goToApi(nodeUrl + '/stats', 'GET', data);
					},
					tags: function(data, verb){
						return goToApi(nodeUrl + '/tags', verb, data);
					}
				};
			}
		};

		return service;
	};

	communityApiService.$inject = ['$http'];

	angular.module('community-shared')
		.service('CommunityApiService', communityApiService);
}());
