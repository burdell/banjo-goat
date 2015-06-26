(function(_) {
	'use strict';
	
	var mediaService = function($http){
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
					return {};
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

		var parseMediaUrl = function(mediaUrl){
			
			if (mediaUrl.indexOf('youtube.com') >= 0) {
				return youTube;
			} 
			// else if (mediaUrl.indexOf('vimeo.com') >= 0) {
			// 	return vimeo;
			// } 
			else {
				//ERROR
			}
		};

		return {
			getMediaData: function(videoUrl) {
				var typedMediaObject = parseMediaUrl(videoUrl);

				return typedMediaObject.getMediaData(videoUrl); 
			}
		};
	};
	mediaService.$inject = ['$http'];

	angular.module('community.services')
		.service('CommunityMediaService', mediaService);

}(window._));