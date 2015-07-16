(function(_) {
	'use strict';
	
	var mediaService = function($http, $q){
		//functions/data without underscores are 'public' API and should be implemented for each type of media
		var youTube = {
			getMediaData: function(videoUrl) {
				var videoId = this._getVideoId(videoUrl);

				return $http({ 
					method: 'get',
					url: 'https://www.googleapis.com/youtube/v3/videos',
					params: {
						part: 'snippet',
						id: videoId,
						key: 'AIzaSyDY8cZaONjMArj_v7QbVIH2QgBF_aA_o04'
					}
				}).then(function(result) {
					var videoData = result.data.items[0];
					var snippet = videoData.snippet;

					return {
						meta: {
							videoId: {
								key: 'videoId',
								value: videoData.id,
							},
							title: {
								key: 'title',
								value: snippet.title,
							},
							origin: {
								key: 'origin',
								value: 'youtube'
							}
						},
						type: 'video',
						url: snippet.thumbnails.medium.url,
					}
				});
			},
			_getVideoId: function(videoUrl) {
				var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				var match = videoUrl.match(regExp);
				if (match && match[2].length == 11) {
				  return match[2];
				} else {
				  //error
				}
			}
		};

		var vimeo = {
			getMediaData: function(videoUrl) {
				var videoId = this._getVideoId(videoUrl);

				return $http({ 
					headers: { 'Authorization': 'bearer 5495aeb8a409e263ac51d9d7312c5ae8' },
					method: 'get',
					url: 'https://api.vimeo.com/videos/' + videoId
				}).then(function(result) {
					var videoData = result.data;

					return {
						meta: {
							videoId: {
								key: 'videoId',
								value: videoId,
							},
							title: {
								key: 'title',
								value: videoData.name,
							},
							origin: {
								key: 'origin',
								value: 'vimeo'
							}
						},
						type: 'video',
						url: videoData.pictures.sizes[2].link
					};
				});

			},
			_getVideoId: function(url) {
				var regExp = /^.*(?:vimeo.com)\/(?:channels\/|channels\/\w+\/|groups\/[^\/]*\/videos\/|album‌​\/\d+\/video\/|video\/|)(\d+)(?:$|\/|\?)/
				var match = url.match(regExp);

				if (match){
				    return match[1];
				} else{
				    //ERROR
				}

			}
		};

		var images = {
			getMediaData: function(imageUrl) {
				return $q.when({
					url: imageUrl,
					type: 'image'
				});
			}
		};

		var parseMediaUrl = function(mediaUrl){
			//YouTube
			if (mediaUrl.indexOf('youtube.com') >= 0) {
				return youTube;
			} 
			//Vimeo
			else if (mediaUrl.indexOf('vimeo.com') >= 0) {
				return vimeo;
			} 
			//Pictures
			else if (mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				return images;
			}
			else {
				//ERROR
			}
		};

		return {
			getMediaType: function(mediaUrl) {
				var mediaType = parseMediaUrl(mediaUrl);
				return mediaType.getMediaData(mediaUrl);
			},
			MediaTypes: {
				'image': 1,
				'video': 2
			},
			isVideo: function(mediaObj) {
				var type = mediaObj.type;

				return type === 'video:youtube' || type === 'video:vimeo';
			}
		};
	};
	mediaService.$inject = ['$http', '$q'];

	angular.module('community.services')
		.service('CommunityMediaService', mediaService);

}(window._));