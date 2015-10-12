(function(_) {
	'use strict';

	var iconService = function(){
		return {
			ToughSw_forum: 'cmuIcon-toughSwitch',
			airMAX: 'cmuIcon-airMax',
			airControl_forum: 'cmuIcon-airControl',
			UniFi: 'cmuIcon-unifi',
			EdgeMAX: 'cmuIcon-edgeMax',
			UniFiVid: 'cmuIcon-unifiVideo',
			mFi: 'cmuIcon-mfi',
			airFiber: 'cmuIcon-airFiber',
			UniFiVoip: 'cmuIcon-unifiVoip',
			UniFiRS: 'cmuIcon-switching',
			EdgeSw: 'cmuIcon-edgeSwitch',
			airCRM_control: 'cmuIcon_airCrmControl',
			airCRM_billing: 'cmuIcon_airCrmBilling',
			airCRM_operations: 'cmuIcon_airCrmOps',
			airCRM_marketing: 'cmuIcon_airCrmMarket'
		};
	};

	angular.module('community.services')
		.service('CommunityIconService', iconService);

}(window._));