(function(_){
	'use strict';

	var communityApiService = function($http, $q, $timeout, errorService){
		function getCallOptions(url, data, verb, isMedia) {
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

			var callOptions =  {
				method: verb,
				url: url,
				params: params,
				data: payload,
				withCredentials: true
			};

			if (isMedia) {
				_.extend(callOptions, { transformRequest: angular.identity, headers: {'Content-Type': undefined} });
			}

			return callOptions;
		}

		function goToApi(url, data, verb, isMedia){
			var callOptions = getCallOptions(url, data, verb, isMedia);
			return $http(callOptions).then(
				function(result){
					//SUCCESS :D
					return result.data.data;
				},
				function(error){
					//ERROR :(
					errorService.showErrors(error);
					return $q.reject();
				}
			);
		}

		function getCallType(callData, params) {
			var id, payload, verb;

			//POST
			if (_.isObject(callData)) {
				verb = 'POST';
				payload = callData;
				id = callData.id;
			}
			//GET
			else {
				payload = params;
				verb = 'GET';
				id = callData;
			}

			return {
				verb: verb,
				id: id,
				payload: payload
			};
		}

		var baseUrl = 'https://comm2-dev.ubnt.com/api/';  // 'http://localhost:8080/'; 
		var v2Url = 'https://comm2-dev.ubnt.com/api2/';

		var urlSegments = {
			Announcement: function(id){
				return 'announcements/' + this._Message(id);
			},
			Node: function(id){
				return 'nodes/id/' + id + '/';
			},
			User: function(id) {
				return 'users/' + id + '/';
			},
			Story: function(id) {
				return 'stories/' + this._Message(id);
			},
			Forum: function(id) {
				return 'forums/'  + this._Message(id);
			},
			_Message: function(id) {
				var urlString = 'topics/';
				if (id) {
					urlString += id + '/';
				}
				return urlString;
			},
		};

		// ****** API DEFINITION ******
		var service = {
			Announcements: {
				all: function(options){
					return goToApi(baseUrl + urlSegments.Announcement(), options);
				},
				count: function(nodeId){
					return goToApi(baseUrl + urlSegments.Announcement() + 'count');
				},
				announcements: function(nodeId, options) {
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'announcements', options);
				}
			},
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
				},
				nodeStructure: function(){
					return goToApi(baseUrl + 'nodes', { limit: 150 }).then(function(result) {
						//var nodeCollection = result.collection

						return result.collection; //window.nodeStructure[0];
					});
				}
			},
			Forums: {
				messages: function(nodeId, data){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics', data);
				},
				message: function(messageData, mock) {
					var callData = getCallType(messageData);
					return goToApi(baseUrl + urlSegments.Forum(callData.id), callData.payload, callData.verb);
				},
				comments: function(messageId, data) {
					return goToApi(baseUrl + urlSegments.Forum(messageId) + 'comments', data);
				},
				messageCount: function(nodeId) {
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics/count', null, "GET");
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
			Media: {
				upload: function(fileData){
					var formData = new FormData();
					formData.append('file', fileData);

					return goToApi(baseUrl + 'media', formData, 'POST', true);
				}
			},
			Stories: {
				all: function(options) {
					return goToApi(baseUrl + urlSegments.Story(), options);
				},
				thread: function(storyId, data){
					return $q.all([ this.story(storyId), this.comments(storyId, data) ])
						.then(function(result) {
							return {
								originalMessage: result[0].model,
								comments: result[1].collection,
								nextCommentMetaData: result[1].next
							};
						});
				},
				story: function(storyData) {
					var callData = getCallType(storyData);

					return goToApi(baseUrl + urlSegments.Story(callData.id), callData.payload, callData.verb);
				},
				comments: function(storyData, params) {
					var callData = getCallType(storyData, params);

					var id = callData.verb === "GET" ? callData.id : callData.payload.topicId;
					return goToApi(baseUrl + urlSegments.Story(id) + 'comments', callData.payload, callData.verb);
				},
				stories: function(nodeId, data){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'stories', data);
				}
			},
			Users: {
				authentication: function(){
					return goToApi(baseUrl + urlSegments.User('self'));
				}
			}
		}

		return service;
	};

	communityApiService.$inject = ['$http', '$q', '$timeout', 'CommunityErrorService'];

	angular.module('community.services')
		.service('CommunityApiService', communityApiService);

}(window._));
