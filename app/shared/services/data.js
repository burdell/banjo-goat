(function(_) {
	'use strict';

	var dataService = function(){
		return {
			MessageSort: [
				{ value: 'recent', label: 'Recent Activity', default: true  },
				{ value: 'postdate', label: 'Post Date'  },
				{ value: 'popular', label: 'Views'  }
			]
		};
	};

	angular.module('community.shared')
		.service('CommunityDataService', dataService);

}(window._));