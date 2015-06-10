(function(_){
	'use strict';
	
	var communityApiService = function($http, $q, $timeout){
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
		
		var baseUrl = 'http://localhost:8080/' //'http://comm2-dev.ubnt.com:8080/';
		var urlSegments = {
			Node: function(id){
				return 'nodes/id/' + id + '/';
			},
			User: function(id) {
				return 'users/' + id + '/';
			},
			Message: function(id) {
				var urlString = 'topics/';
				if (id) {
					urlString += id + '/';
				}
				return urlString;
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
					return goToApi(baseUrl + urlSegments.User(userId));
				}
			},
			Forums: {
				message: function(messageData, mock) {
					var messageId, messagePayload, verb;

					//POST new message
					if (_.isObject(messageData)) {
						messagePayload = messageData;
						verb = 'POST';
					} 
					//GET exsiting message
					else {
						messageId = messageData;
						verb = 'GET';

					}

					return goToApi(baseUrl + 'forums/' + urlSegments.Message(messageId), messagePayload, verb);
				},
				messages: function(nodeId, data){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics', data);
				},
				messageCount: function(nodeId) {
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics/count', null, "GET");
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
								comments: result[1].collection,
								nextCommentMetaData: result[1].next
							};
						});
				}
			}
		};

		return service;
	};

	communityApiService.$inject = ['$http', '$q', '$timeout'];

	angular.module('community.services')
		.service('CommunityApiService', communityApiService);

}(window._));
