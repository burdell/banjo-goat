
'use strict';

var _ = require('underscore');
var $ = require('jquery');
var typeahead = require('typeahead.js-browserify');
typeahead.loadjQueryPlugin();

function autocomplete(communityApi) {
	var link = function(scope, element, attrs) {
		
		$(element).typeahead({
			minLength: 3
		},
		{
			name: 'users',
			value: 'login',
			source: function(q, sync, async) {
				communityApi.Users.search(q).then(function(result){
					var logins = _.pluck(result.content, 'login')
					async(logins);
				});
			}
		});
	};
	
    var directive = {
    	link: link,
        restrict: 'A',
        scope: true,
        replace: true
    };
    return directive;
}
autocomplete.$inject = [require('services/api.js')];

angular.module('community.directives')
	.directive('communityAutocomplete', autocomplete);
	
