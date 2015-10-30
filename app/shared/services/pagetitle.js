
'use strict';

var pageTitleService = function($window){
	var errorList = [];

	var DEFAULT_TITLE = 'UBNT Community';

	var title = '';
	var subtitle = '';
	var notificationCount = 0;

	function setFullTitle(){
		var fullTitle = title || DEFAULT_TITLE;
		
		if (notificationCount) {
			fullTitle = '(' + notificationCount + ') ' + fullTitle; 
		}

		if (subtitle) {
			fullTitle = fullTitle + ' | ' + subtitle;
		}

		$window.document.title = fullTitle;
	}

	return {
		setTitle: function(newTitle, resetSubtitle){
			title = newTitle;
			if (resetSubtitle) {
				subtitle = '';
			}
			setFullTitle();
		},
		setNotifications: function(notificationCount) {
			notificationCount = notificationCount;
			setFullTitle();
		},
		setSubtitle: function(newSubtitle){
			subtitle = newSubtitle;
			setFullTitle();
		},
		removeNotifications: function(){

		}
	};	
};
pageTitleService.$inject = ['$window'];


var serviceName = 'CommunityPageTitleService';
angular.module('community.services')
	.service(serviceName, pageTitleService);

module.exports = serviceName;


