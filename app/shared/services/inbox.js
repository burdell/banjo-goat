
'use strict';

var _ = require('underscore');

var inboxService = function(localizationService){
	var inboxStrings = localizationService.data.core;
	return {
		getRecipientString: function(recipientData, numberOfRecs) {
			if (!numberOfRecs) {
				numberOfRecs = 3;
			}

			var recipientString = '';
			var RECIPIENTS_SHOWN = numberOfRecs;

			var recipientList = _.first(recipientData.content, RECIPIENTS_SHOWN);
			var recipientCount = recipientList.length;

			_.each(recipientList, function(recipient, index){
				recipientString += recipient.user.login;
				if (index < recipientCount - 1) {
					recipientString += ', '
				}
			});

			var moreRecipients = recipientData.totalElements - RECIPIENTS_SHOWN;
			if (moreRecipients > 0) {
				recipientString += ' & ' + moreRecipients + (moreRecipients > 1 ? ' ' + inboxStrings.others : ' ' + inboxStrings.other);
			}

			return recipientString;
		},
		newDataCount: 0
	}
};
inboxService.$inject = ['CommunityLocalizationService'];


var serviceName = 'CommunityInboxService';
angular.module('community.services')
	.service(serviceName, inboxService);

module.exports = serviceName;
