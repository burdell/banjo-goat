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
						type: 'video',
						title: snippet.title,
						imageUrl: snippet.thumbnails.medium.url,
						videoId: videoData.id
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
					method: 'get',
					url: 'https://api.vimeo.com/videos/' + videoId
				}).then(function(result) {
					return {
						type: 'image'
					};
				});

			},
			_getVideoId: function(videoUrl) {
				var url = "http://www.vimeo.com/7058755";
				var regExp = /^.*(vimeo\.com\/)?([0-9]+)/

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
					type: 'image',
					imageUrl: imageUrl
				});
			}
		}

		var parseMediaUrl = function(mediaUrl){
			//YouTube
			if (mediaUrl.indexOf('youtube.com') >= 0) {
				return youTube;
			} 
			//Vimeo
			// else if (mediaUrl.indexOf('vimeo.com') >= 0) {
			// 	return vimeo;
			// } 
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
			}
		};
	};
	mediaService.$inject = ['$http', '$q'];

	angular.module('community.services')
		.service('CommunityMediaService', mediaService);

}(window._));