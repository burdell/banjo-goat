
//vendor
require('angular/angular.js');
require('ui-router/release/angular-ui-router.js');
require('angular-ui-select/dist/select.min.js');
require('angular-sanitize');
// require('Sortable/Sortable.js');
// require('Sortable/ng-sortable');

function initializeApp(areaName) {
    var baseTag = document.createElement('base');
    baseTag.setAttribute('href', '/');
    document.head.appendChild(baseTag);
    
    var moduleBuilder = require('modulebuilder');

    angular.module('communityApp', [
        'ui.router',
        'ui.select',
        'ngSanitize',
        //'ng-sortable',
        'community.templates',
        moduleBuilder('community.providers'),
        moduleBuilder('community.services'),
        moduleBuilder('community.directives'),
        moduleBuilder('community.filters'),
        moduleBuilder('community.' + areaName)
    ]).run(['$rootScope', '$state', '$window', require('services/currentuser'), function($rootScope, $state, $window, currentUser){
        $rootScope.$on('$stateChangeSuccess', function(){
            $window.scrollTo(0,0);
        });
    }]);

    //core stuff
    require('directives/mainnavbar/mainnavbar.js');
    require('directives/breadcrumbs/breadcrumbs.js');
    require('directives/discussionsnavbar/discussionsnavbar.js');
    require('directives/megamenu/megamenu.js');
    require('directives/pageheader/pageheader.js');
    
    require('basecontroller.js');

    angular.element(document).ready(function(){
        angular.bootstrap(document, ['communityApp']);
    });
}

module.exports = initializeApp;

