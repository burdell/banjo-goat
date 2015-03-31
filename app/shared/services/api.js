(function(_){
	'use strict';
	
	var communityApiService = function($http){
		function goToApi(url, data, verb){
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
				url: url,
				params: params,
				data: payload
			}).then(function(result){
				return result.data.data;
			});
		}
		
		var baseUrls = {
			Core: '/uc/api/',
			Forums: '/uf/api/'
		};

		var urlSegments = {
			Node: function(id){
				return 'nodes/' + id + '/';
			},
			User: function(id) {
				return 'users/' + id + '/';
			},
			Message: function(id) {
				return 'messages/' + id + '/';
			}
		};

		// ****** API DEFINITION ******
		var service = {
			Core: {
				advert: function(){
					return goToApi(baseUrls.Core + 'advert');
				},
				breadcrumbs: function(nodeId){
					return goToApi(baseUrls.Core + urlSegments.Node(nodeId) + 'breadcrumbs');
				},
				tags: function(nodeId, options){
					return goToApi(baseUrls.Core + urlSegments.Node(nodeId) + 'tags');
				},
				userSummary: function(userId){
					return goToApi(baseUrls.Core + urlSegments.User(userId) + 'summary');
				}
			},
			Forums: {
				message: function(messageId, data, verb) {
					return goToApi(baseUrls.Forums + urlSegments.Message(messageId));
				},
				messages: function(nodeId, data){
					return goToApi(baseUrls.Forums + urlSegments.Node(nodeId) + 'messages', data);
				},
				comments: function(messageId, data) {
					return goToApi(baseUrls.Forums + urlSegments.Message(messageId) + 'comments');
				},
				stats: function(nodeId, data) {
					return goToApi(baseUrls.Forums + urlSegments.Node(nodeId) + 'stats');
				}
			}
		};

		return service;
	};

	communityApiService.$inject = ['$http'];

	angular.module('community.shared')
		.service('CommunityApiService', communityApiService);

}(window._));
