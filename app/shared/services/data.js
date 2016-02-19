
'use strict';

var dataService = function(localizationService){

	var coreStrings = localizationService.data.core;
	var areas = coreStrings.areas;
	var standardSort = coreStrings.standardSort;

	return {
		MessageSort: [
			{ value: 'postDate', label: standardSort.postDate, default: true },
		    { value: 'lastActivityDate', label: standardSort.recentActivity },
			{ value: 'countViews', label: coreStrings.views }
		],
		SearchConfig: {
			delay: 300
		},
		DiscussionTypeSort: [
			{ value: null, label: localizationService.data.core.allTopics, default: true }, 
			{ value: 'stories', label: areas.stories  },
			{ value: 'announcements', label: areas.announcements  },
			{ value: 'forums', label: areas.forums },
			{ value: 'features', label: areas.features }
		],
		DiscussionTypeIcons: {
			features: 'features',
			stories: 'stories',
			announcements: 'announcements',
			forums: 'forums',
			qna: 'qa'
		}
	};
}
dataService.$inject = ['CommunityLocalizationService'];

var serviceName = 'CommunityDataService';
angular.module('community.services')
	.service(serviceName, dataService);
module.exports = serviceName;

