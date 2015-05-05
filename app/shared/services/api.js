(function(_){
	'use strict';
	
	var communityApiService = function($http, $q){
		function getCallOptions(url, data, verb) {
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

			return {
				method: verb,
				url: url,
				params: params,
				data: payload
			};
		}

		function goToApi(url, data, verb){
			var callOptions = getCallOptions(url, data, verb);
			return $http(callOptions).then(function(result){
				return result.data.data;
			});
		}
		
		var baseUrl = 'http://comm2-dev.ubnt.com:8080/';
		var urlSegments = {
			Node: function(id){
				return 'nodes/id/' + id + '/';
			},
			User: function(id) {
				return 'users/' + id + '/';
			},
			Message: function(id) {
				return 'topics/' + id + '/';
			}
		};

		// ****** API DEFINITION ******
		var service = {
			Core: {
				advert: function(){
					return goToApi(baseUrl + 'advert');
				},
				breadcrumbs: function(nodeId){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'breadcrumbs');
				},
				tags: function(nodeId, options){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'tags');
				},
				userSummary: function(userId){
					return goToApi(baseUrl + urlSegments.User(userId) + 'summary');
				}
			},
			Forums: {
				message: function(messageId, data, verb) {
					return goToApi(baseUrl + 'forums/' + urlSegments.Message(messageId));
				},
				messages: function(nodeId, data){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics', data);
				},
				comments: function(messageId, data) {
					return goToApi(baseUrl + 'forums/' + urlSegments.Message(messageId) + 'comments', data);
				},
				stats: function(nodeId, data) {
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'stats');
				},
				thread: function(messageId, data){
					return $q.all([ this.message(messageId), this.comments(messageId, data) ])
						.then(function(result) {
							return {
								originalMessage: result[0].model,
								comments: result[1].collection
							}
						});
				}
			}
		};

		return service;
	};

	communityApiService.$inject = ['$http', '$q'];

	angular.module('community.services')
		.service('CommunityApiService', communityApiService);

}(window._));
