

'use strict';

var CookieService = function(nodeServiceWrapper){
	
	console.log('cookie service');
	// console.log($cookies)
	// $cookies.put('myFavorite', 'oatmeal');

	var nodeServiceHolder = null;

		function setNodeUrl(node) {
			if (!node || node.href) {
				return;
			}

			node.href = routingService.generateUrl(node.discussionStyle + '.list', { nodeId: node.urlCode });
		}

	var PRODUCT_NODE = 75;
	var UBNT_NODE = 569;
	var OTHER_PRODUCTS_NODE = 121;

	return {
		CookieList: [],
		CurrentCookie: null,
		getCookieData: function(nodeId, syncToNodeStructure){
			var CookieList = [];
			var service = this;

				return this.getCurrentCookie(nodeId, syncToNodeStructure).then(function(currentCookie){
					var parentNode = nodeServiceHolder.parent(currentCookie.id);
					while(parentNode) {
						//hide the 'products' abnd 'ubnt' node

						if (parentNode.id !== PRODUCT_NODE && parentNode.id !== UBNT_NODE && parentNode.id !== OTHER_PRODUCTS_NODE) {
							setNodeUrl(parentNode);
							CookieList.unshift(parentNode);
						}

						//if node is a product, set url to landing page
						if (parentNode.parentId === PRODUCT_NODE) {
							parentNode.href = routingService.generateUrl('hub', { nodeId: parentNode.urlCode });
						}

					parentNode = nodeServiceHolder.parent(parentNode.id);
				}
				service.CookieList = CookieList;

				if (service.onDataSet) {
					service.onDataSet();
					service.onDataSet = null;
				}

				return {
					currentCookie: service.CurrentCookie,
					CookieList: service.CookieList
				}
			});
		},
		getCurrentCookie: function(nodeId, syncToNodeStructure){
			var service = this;
			return nodeServiceWrapper.get(nodeId).then(function(nodeService){
				if (!service.CurrentCookie || syncToNodeStructure) {
					service.CurrentCookie = nodeService.CurrentNode;
					setNodeUrl(service.CurrentCookie);
				}
				nodeServiceHolder = nodeService;
				return service.CurrentCookie;
			});
		},
		setCurrentCookie: function(subnodeName){
			var service = this;

			function setCrumb() {
				var currentCookie = service.CurrentCookie;
				if (currentCookie) {
					service.CookieList.push(currentCookie);
				}

				service.CurrentCookie = {
					name: subnodeName,
					parent: currentCookie
				};
				pageTitleService.setSubtitle(subnodeName);
			}
			
			setCrumb();
			service.onDataSet = setCrumb;
			
		},
		clearCurrentCookie: function(){
			this.onDataSet = null;
			this.CookieList.pop();
			this.CurrentCookie = this.CurrentCookie.parent;
		}
	};
};

CookieService.$inject = [require('services/nodestructure.js'), require('services/pagetitle.js'), require('services/routing.js')];

// CookieService.$inject = ['ngCookies']//[require('services/nodestructure.js'), require('services/pagetitle.js'), require('services/routing.js')];


var serviceName = 'CommunityCookieService';
angular.module('community.services')
	.service(serviceName, CookieService);
module.exports = serviceName;




// 'use strict';


// var cookieService = function ($scope, $cookies) {

// 	console.log('cook cook');
// 	return {
// 		// function log() {
// 			// console.log('cookie cuts the dough');
// 		// }

// 		// Retrieving a cookie
// 		// var favoriteCookie = $cookies.get('myFavorite');
// 		// // Setting a cookie
// 		// $cookies.put('myFavorite', 'oatmeal');
// 	};


// // 	angular.module('cookiesExample', ['ngCookies'])
// // .controller('ExampleController', ['$cookies', function($cookies) {
// //   // Retrieving a cookie
// //   var favoriteCookie = $cookies.get('myFavorite');
// //   // Setting a cookie
// //   $cookies.put('myFavorite', 'oatmeal');
// // }]);

// 	// controller.$inject = ['$scope', '$cookies'];

//  //    // var directive = {
//  //    //     controller: controller,
//  //    //     templateUrl: 'directives/announcement/announcement.html',
//  //    //     controllerAs: 'announcement',
//  //    //     bindToController: true,
//  //    //     replace: true,
//  //    //     restrict: 'E',
//  //    //     scope: { }
//  //    // };
//  //    // return directive;
// } 

// // angular.module('community.services')
// // 	.directive('cookies', cookies);

// cookieService.$inject = ['$scope', 'ngCookies'];

// var serviceName = 'CommunityCookieService';
// angular.module('community.services')
// 	.service(serviceName, cookieService);
// module.exports = serviceName;



// // angular.module('cookiesExample', ['ngCookies'])
// // .controller('ExampleController', ['$cookies', function($cookies) {
// //   // Retrieving a cookie
// //   var favoriteCookie = $cookies.get('myFavorite');
// //   // Setting a cookie
// //   $cookies.put('myFavorite', 'oatmeal');
// // }]);