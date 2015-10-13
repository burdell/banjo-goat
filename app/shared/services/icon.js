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
			airCRM_Control: 'cmuIcon-airCrmControl',
			airCRM_Billing: 'cmuIcon-airCrmBilling',
			airCRM_Operations: 'cmuIcon-airCrmOps',
			airCRM_Marketing: 'cmuIcon-airCrmMarket'
		};
	};

	angular.module('community.services')
		.service('CommunityIconService', iconService);

}(window._));