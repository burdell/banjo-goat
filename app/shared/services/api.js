<<<<<<< HEAD
(function(_){
	'use strict';

	var communityApiService = function($http, $q, $timeout, errorService){
		function getCallOptions(url, data, verb, isMedia) {
			if (_.isUndefined(verb)) {
				verb = 'GET';
			}
=======
'use strict';
>>>>>>> master

require('shared/services/error.js');
var _ = require('underscore');

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
					if (result.data.data) {
						return result.data.data
					} else {
						return result.data;
					}
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
				id = callData.id ? callData.id : '';
			}
			//GET
			else {
				payload = params;3
				verb = 'GET';
				id = callData;
			}

		return {
			verb: verb,
			id: id,
			payload: payload
		};
	}

		var v2Url = 'https://comm2-dev-api.ubnt.com/2/';
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
			Feed: function(){
				return 'feed';
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
					return goToApi(v2Url + 'announcements/', options);
				},
				announcements: function(nodeId, options) {
					return goToApi(v2Url + urlSegments.Node(nodeId) + 'topics', options);
				},
				detail: function(announcementId){
					return goToApi(v2Url + 'announcements/' + announcementId);
				},
				comments: function(announcementId, commentData){
					return goToApi(v2Url + 'announcements/' + announcementId + '/comments');
				},
				thread: function(announcementId){
					return $q.all([ this.detail(announcementId), this.comments(announcementId) ]).then(function(result){
						return {
							originalMessage: result[0],
							comments: result[1]
						}
					});
				}
			},
			Core: {
				nodeStructure: function(){
					return goToApi(v2Url + 'nodes', { per_page: 140 }).then(function(result) {
						return result.content;
					});
				},
				message: function(messageData){
					var callData = getCallType(messageData);
					return goToApi(v2Url + 'messages', callData.payload, callData.verb);
				}
			},
			Feed: {
				allContent: function(options){
					return goToApi(v2Url + urlSegments.Feed() + '/content', options);
				},
				notifications: function(options){
					return goToApi(v2Url + urlSegments.Feed() + '/notifications', options);
				},
				subscriptions: function(options){
					return goToApi(v2Url + urlSegments.Feed() + '/subscriptions', options);
				}
			},
			Forums: {
				messages: function(nodeId, data){
					return goToApi(v2Url + urlSegments.Node(nodeId) + 'topics', data);
				},
				message: function(messageData, mock) {
					var callData = getCallType(messageData);

					var url = v2Url + 'forums/';
					if (callData.verb === 'GET' || callData.verb === 'PUT') {
						url += callData.id;
					}

					return goToApi(url, callData.payload, callData.verb);
				},
				comments: function(messageId, data) {
					return goToApi(v2Url + 'forums/' + messageId + '/comments', data);
				},
				thread: function(messageId, data){
					return $q.all([ this.message(messageId), this.comments(messageId, data) ])
						.then(function(result) {
							return {
								originalMessage: result[0],
								comments: result[1]
							};
						});
				}
			},
			Features: {
				features: function(nodeId, options){
					return goToApi(v2Url + urlSegments.Node(nodeId) + 'topics', options);
				},
				thread: function(messageId, data){
					return $q.all([ this.message(messageId), this.comments(messageId, data) ])
						.then(function(result) {
							return {
								originalMessage: result[0],
								comments: result[1]
							};
						});
				},
				message: function(messageData, mock) {
					var callData = getCallType(messageData);
					return goToApi(v2Url + 'features/' + callData.id, callData.payload, callData.verb);
				},
				comments: function(messageId, options) {
					return goToApi(v2Url + 'features/' + messageId + '/comments', options);
				}
			},
			Media: {
				upload: function(fileData){
					var formData = new FormData();
					formData.append('file', fileData);

					return goToApi(v2Url + 'media', formData, 'POST', true);
				}
			},
			Stories: {
				all: function(options) {
					return goToApi(v2Url + 'stories', options);
				},
				thread: function(storyId, data){
					return $q.all([ this.story(storyId), this.comments(storyId, data) ])
						.then(function(result) {
							return {
								originalMessage: result[0],
								comments: result[1]
							};
						});
				},
				story: function(storyData) {
					var callData = getCallType(storyData);
					return goToApi(v2Url + 'stories/' + callData.id, callData.payload, callData.verb);
				},
				comments: function(storyData, params) {
					var callData = getCallType(storyData, params);

					var id = callData.verb === "GET" ? callData.id : callData.payload.topicId;
					return goToApi(v2Url + 'stories/' + id + '/comments', callData.payload, callData.verb);
				},
				stories: function(nodeId, data){
					return goToApi(v2Url + urlSegments.Node(nodeId) + 'topics', data);
				}
			},

			Users: {
				authentication: function(){
					return goToApi(v2Url + urlSegments.User('self'));
				}
			}
		}

	return service;
};

communityApiService.$inject = ['$http', '$q', '$timeout', 'CommunityErrorService'];

var serviceName = 'CommunityApiService';
angular.module('community.services')
	.service(serviceName, communityApiService);

module.exports = serviceName;

