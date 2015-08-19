(function(){
	'use strict';	
		angular.module('community.features', [])
			.factory('FeaturesDataService', function(){
				return {
					StatusTypes: {
						1: { code: 'fixed', display: 'Fixed' },
						2: { code: 'pending', display: 'Pending' },
						3: { code: 'inprogress', display: 'In Progress' },
						4: { code: 'invalid', display: 'Invalid' },
						5: { code: 'unspecified', display: 'Unspecified' },
						6: { code: 'wontfix', display: 'Wont\'t Fix' }
					},
					SeverityLevels: {
						1: { code: 'high', display: 'High' },
						2: { code: 'medium', display: 'Medium' },
						3: { code: 'low', display: 'Low' }
					}
				}
			});
}());
