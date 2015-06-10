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
		
		var baseUrl = 'http://localhost:8080/'; http://comm2-dev.ubnt.com:8080/';
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
			},
			Stories: {
				thread: function(messageId, data){
					return $q.all([ this.message(messageId), this.comments(messageId, data) ])
						.then(function(result) {
							return {
								originalMessage: result[0].model,
								comments: result[1].collection,
								nextCommentMetaData: result[1].next
							};
						});
				},
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
					
					return goToApi(baseUrl + 'forums/' + urlSegments.Message(messageId), messagePayload, verb).then(function(result){
						_.extend(result.model, { 
							summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." ,
							location: 'Atlanta, GA',
							projectRole: 'Engineer',
							finishDate: "2013-08-21T11:33:28.000-04:00",
							numberofUsers: 200,
							budgetAmount: 50000,
							numberOfWorkers: 4,							
							dataRequirement: "HELLO THERE",
							bandwidth: "HELLO THERE",
							coverPhotoUrl: "http://thecatapi.com/api/images/get?format=src"
						});

						return result;
					});
				},
				comments: function(messageId, data) {
					return goToApi(baseUrl + 'forums/' + urlSegments.Message(messageId) + 'comments', data).then(function(result) {
						_.each(result.collection, function(message){
							_.extend(message, { summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." })
						});

						return result;
					})
				},
				messages: function(nodeId, data){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics', data);
				}
			}
		};

		return service;
	};

	communityApiService.$inject = ['$http', '$q', '$timeout'];

	angular.module('community.services')
		.service('CommunityApiService', communityApiService);

}(window._));
