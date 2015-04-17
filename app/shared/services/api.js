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
		
		var baseUrls = {
			Core: '/api/',
			Forums: '/api/'
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
					return goToApi(baseUrls.Forums + urlSegments.Message(messageId) + 'comments', data);
				},
				stats: function(nodeId, data) {
					return goToApi(baseUrls.Forums + urlSegments.Node(nodeId) + 'stats');
				},
				thread: function(messageId, data){
					debugger;
					return $q.all([ this.message(messageId), this.comments(messageId, data) ])
						.then(function(result) {
							var originalMessage = [ result[0].content ];
							var comments = result[1].content;
							return originalMessage.concat(comments);
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
