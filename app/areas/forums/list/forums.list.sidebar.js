(function(){
	'use strict';

	var sidebarController = function(forumListFilter, forumListService){
		this.forumListFilter = forumListFilter;
		this.forumListService = forumListService;
	};
	sidebarController.$inject = ['ForumListFilter', 'ForumListService'];

	angular.module('community.forums')
		.controller('ForumListSidebar', sidebarController);

}());
