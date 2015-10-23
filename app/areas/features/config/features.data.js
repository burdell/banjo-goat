
'use strict';	

angular.module('community.features')
	.factory('FeaturesDataService', function(){
		return {
			StatusTypes: {
				'New': { code: 'pending', display: 'New' },
				'Accepted': { code: 'inprogress', display: 'Accepted' },
				'Under Consideration': { code: 'unspecified', display: 'Under Consideration' },
				'Duplicate': { code: 'wontfix', display: 'Duplicate' },
				'Future Consideration': { code: 'invalid', display: 'Future Consideration' },
				'Implemented': { code: 'fixed', display: 'Implemented' },
			},
			SeverityLevels: {
				1: { code: 'high', display: 'High' },
				2: { code: 'medium', display: 'Medium' },
				3: { code: 'low', display: 'Low' }
			}
		}
	});

