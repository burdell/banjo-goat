(function(_) {
	'use strict';

	var dataService = function(){
		return {
			MessageSort: [
				{ value: 'latest', label: 'Newest'  },
				{ value: 'active', label: 'Active'  },
				{ value: 'hottest', label: 'Hottest'  },
				{ value: 'mostvoted', label: 'Most Voted'  },
				{ value: 'unanswered', label: 'Unanswered'  }
			]
		};
	};

	angular.module('community.shared')
		.service('CommunityDataService', dataService);

}(window._));