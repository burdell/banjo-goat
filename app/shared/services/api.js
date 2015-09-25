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
				id = callData.id;
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

		var baseUrl = 'https://comm2-dev.ubnt.com/api/';  // 'http://localhost:8080/'; 
		var v2Url = 'https://comm2-dev.ubnt.com/api2/2/';

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
				count: function(nodeId){
					return goToApi(baseUrl + urlSegments.Announcement() + 'count');
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
								originalMessage: result[0],
								comments: result[1]
							};
						});
				}
			},
			Features: {
				features: function(nodeId, options){
					return goToApi(baseUrl + urlSegments.Announcement(), options).then(function(result){
						_.each(result.collection, function(feature) {
							feature.discussion.statusType =  Math.floor(Math.random() * (6 - 1 + 1)) + 1;
						});
						return result;
					});
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
				},
				message: function(messageData, mock) {
					var callData = getCallType(messageData);
					return goToApi(baseUrl + urlSegments.Forum(callData.id), callData.payload, callData.verb).then(function(result){
						_.extend(result.model, {
							statusType: Math.floor(Math.random() * (6 - 1 + 1)) + 1,
							productId: 111,
							meta: {
								versionNumber: {
									key: 'version',
									value: '1.1.1.1'
								},
								issueId: {
									key: 'issueId',
									value: 'LOL1234'
								}
							}
						});

						return result;
					});
				},
				comments: function(messageId, data) {
					return goToApi(baseUrl + urlSegments.Forum(messageId) + 'comments', data);
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
					return goToApi(v2Url + 'stories', options);
				},
				thread: function(storyId, data){
					//return this.comments(storyId, data);
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
				},
				test: function(options){
					// return goToApi(v2Url + urlSegments.Feed() + '/notifications', options);

					return goToApi(v2Url + '/stories', options);
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

	angular.module('community.services')
		.service('CommunityApiService', communityApiService);

}(window._));
