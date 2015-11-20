'use strict';

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

	function emptyResponse() {
		return $q.when({
			content: []
		})
	}

	function hasNoStories(nodeUrlCode){
		return nodeUrlCode === 'comm_stories' || nodeUrlCode.indexOf('airCRM') >= 0
	}

	var v2Url = 'https://comm2-dev-api.ubnt.com/2/'; // original
	var v2Url = 'http://localhost:8080/2/'; // local java
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
				return goToApi(v2Url + 'announcements/threads', options);
			},
			announcements: function(nodeId, options) {
				return goToApi(v2Url + urlSegments.Node(nodeId) + 'threads', options);
			},
			detail: function(announcementId){
				return goToApi(v2Url + 'announcements/' + announcementId);
			},
			comments: function(announcementId, commentData){
				return goToApi(v2Url + 'announcements/' + announcementId + '/comments', commentData);
			},
			thread: function(announcementId, options){
				return $q.all([ this.detail(announcementId), this.comments(announcementId, options) ]).then(function(result){
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
			pulse: function(nodeUrlCode) {
				if (nodeUrlCode) {
					return goToApi(v2Url + urlSegments.Node(nodeUrlCode) + 'pulse');
				} else {
					return goToApi(v2Url + 'pulse');
				}
			},
			search: function(type, filterModel){
				if (!filterModel.q) {
					return emptyResponse();
				}

				var searchUrl = v2Url + 'search/' + type
				var page = filterModel.page;
				if (page) {
					searchUrl += '?page=' + page;
				}

				return goToApi(searchUrl, filterModel, 'POST');
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
			},
			count: function(type, options){
				var countUrl = type === 'notifications' ? (urlSegments.Feed() + '/notifications') : 'inbox'; 
				return goToApi(v2Url + countUrl + '/count', options);
			},
			inbox: function(options){
				return goToApi(v2Url + 'inbox', options);
			},
			inboxMessage: function(messageData, options) {
				var callData = getCallType(messageData, options);
				var url = v2Url + 'inbox';
				if (callData.verb === 'GET' || callData.verb === 'PUT') {
					url += '/' + callData.id;
				}
				return goToApi(url, callData.payload, callData.verb).then(function(result){
					result.totalPages = result.messages.totalPages;
					return result;
				});
			}
		},
		Forums: {
			messages: function(nodeId, data){
				return goToApi(v2Url + urlSegments.Node(nodeId) + 'threads', data);
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
				return goToApi(v2Url + urlSegments.Node(nodeId) + 'threads', options);
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
				return goToApi(v2Url + 'features/' + messageId + '/comments', options).then(function(result){
					if (result.totalElements) {
						result.totalElements = result.totalElements - 1;
					}
					
					return result;
				});
			}
		},
		Gamification: {
			info: function(){
				return goToApi(v2Url + 'gamify/info', null, 'GET');
			}
		},
		Media: {
			upload: function(fileData){
				var formData = new FormData();
				formData.append('file', fileData);

				return goToApi(v2Url + 'media', formData, 'POST', true);
			}
		},
		Messages: {
			topic: function(discussionStyle, data){
				if (discussionStyle === 'directory') {
					return this.Feed.inboxMessage(data);
				}

				var callData = getCallType(data);


				var url = v2Url + discussionStyle;
				if (callData.verb === 'GET' || callData.verb === 'PUT') {
					url += '/' + callData.id;
				}
				return goToApi(url, callData.payload, callData.verb);

			},
			message: function(messageData){
				var callData = getCallType(messageData);
				return goToApi(v2Url + 'messages', callData.payload, callData.verb);
			},
			position: function(messageId){
				return goToApi(v2Url + 'messages/' + messageId + '/position');
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
				if (hasNoStories(nodeId)) {
					return emptyResponse();
				}

				return goToApi(v2Url + urlSegments.Node(nodeId) + 'topics', data);
			},
			search: function(options){
				if (options.nodeUrlCode && hasNoStories(options.nodeUrlCode)) {
					return emptyResponse();
				}
				return goToApi(v2Url + 'stories/search', options, 'GET');
			}
		},
		Users: {
			authentication: function(){
				return goToApi(v2Url + urlSegments.User('self'));
			},
			userData: function(userId){
				return goToApi(v2Url + urlSegments.User(userId), null, 'GET');
			},
			search: function(q) {
				return goToApi(v2Url + 'users/search', { q: q });
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

