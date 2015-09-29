(function(){
	'use strict';	
		angular.module('community.features', [])
			.factory('FeaturesDataService', function(){
				return {
					StatusTypes: {
						'Fixed': { code: 'fixed', display: 'Fixed' },
						'New': { code: 'pending', display: 'Pending' },
						'InProgress': { code: 'inprogress', display: 'In Progress' },
						'Invalid': { code: 'invalid', display: 'Invalid' },
						'Unspecified': { code: 'unspecified', display: 'Unspecified' },
						'WontFix': { code: 'wontfix', display: 'Wont\'t Fix' }
					},
					SeverityLevels: {
						1: { code: 'high', display: 'High' },
						2: { code: 'medium', display: 'Medium' },
						3: { code: 'low', display: 'Low' }
					}
				}
			});
}());
