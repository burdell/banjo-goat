
'use strict';

var dataService = function(){
	return {
		MessageSort: [
			{ value: 'postDate', label: 'Post Date', default: true },
		    { value: 'lastActivityDate', label: 'Recent Activity' },
			{ value: 'countViews', label: 'Views' }
		],
		SearchConfig: {
			delay: 300
		},
		DiscussionTypeSort: [
			{ value: null, label: 'All Topics', default: true }, 
			{ value: 'stories', label: 'Stories'  },
			{ value: 'announcements', label: 'Announcements'  },
			{ value: 'forums', label: 'Forums' },
			{ value: 'features', label: 'Feature Requests' }
		],
		DiscussionTypeIcons: {
			features: 'ubnt-icon--gears',
			stories: 'ubnt-icon--news',
			announcements: 'ubnt-icon--dish',
			forums: 'ubnt-icon--chat-bubbles-2',
			qna: 'ubnt-icon--question'
		}
	};
};

var serviceName = 'CommunityDataService';
angular.module('community.services')
	.service(serviceName, dataService);
module.exports = serviceName;

