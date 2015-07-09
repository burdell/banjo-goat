(function(_){
	'use strict';
	
	var communityApiService = function($http, $q, $timeout, errorService){
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

		function getCallType(callData) {
			var id, payload, verb;

			//POST
			if (_.isObject(callData)) {
				payload = callData;
				verb = 'POST';
			} 
			//GET
			else {
				id = callData;
				verb = 'GET';
			}

			return {
				verb: verb,
				id: id,
				payload: payload
			};
		}
		
		var baseUrl = 'http://comm2-dev.ubnt.com:8080/'; //'http://localhost:8080/'

		var urlSegments = {
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
			Stories: {
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
				comments: function(storyId) {
					return goToApi(baseUrl + urlSegments.Story(storyId) + 'comments');
				},
				stories: function(nodeId, data){
					return goToApi(baseUrl + urlSegments.Node(nodeId) + 'topics', data);
				}
			},
			Files: {
				upload: function(fileData){
					//http://i.imgur.com/ezJLz9L.jpg
					//http://www.dogster.com/wp-content/uploads/2015/05/doge.jpg
					//http://i1.kym-cdn.com/entries/icons/facebook/000/011/656/sophiscated_cat.PNG
					var fd = new FormData();
			        fd.append('file', fileData.file);

			        var images = [
			        	'http://i.imgur.com/oaIMnB1.jpg',
			        	'http://i.imgur.com/sonXcK6.jpg',
			        	'http://i.imgur.com/8anTa91.jpg',
			        	'http://i.imgur.com/VR650uJ.jpg'
			        ];
			        var bleh = Math.floor(Math.random() * images.length)

					return $timeout(function(){
						return {
							fileUrl: images[bleh],
							fileCaption: fileData.fileCaption
						}
					}, 700)
					
			        // $http.post(uploadUrl, fd, {
			        //     transformRequest: angular.identity,
			        //     headers: {'Content-Type': undefined}
			        // }).then(function(){

			        // });
				}
			}
		}

		return service;
	};

	communityApiService.$inject = ['$http', '$q', '$timeout', 'CommunityErrorService'];

	angular.module('community.services')
		.service('CommunityApiService', communityApiService);

}(window._));
