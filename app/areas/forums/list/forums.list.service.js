(function() {
	'use strict';
	
	var forumListService = function(){
		return {
			ForumMessageList: null,
			CurrentNode: null
		};
	};
	
	angular.module('community.forums')
		.service('ForumListService', forumListService);

}());