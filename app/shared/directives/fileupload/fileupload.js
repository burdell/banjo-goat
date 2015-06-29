(function(_){
	'use strict';

	function communityFileUpload($timeout) {
		function link(scope, element, attrs) {
			var inputElement = element.find('input');
			var formElement = element.find('form');

			element.on('change', function(){
				scope.$apply(function(){
					scope.fileupload.upload(inputElement[0].files[0]);
				})
			});

			scope.fileupload.resetInput = function(){
				formElement[0].reset();
			};
		}

		function controller(communityApi) {	
			var ctrl = this;

			_.extend(ctrl, {
				upload: function(file){
					ctrl.uploadInProgress = true;
					communityApi.Files.upload(file).then(function(result){
						ctrl.uploadInProgress = false;

						if (ctrl.onSuccessFn) {
							ctrl.onSuccessFn(result);
						} else {
							if (!ctrl.fileListModel) {
								ctrl.fileListModel = [];
							}
							
							var fileData = result;
							ctrl.fileListModel.push({
								fileUrl: fileData.fileUrl,
								fileCaption: fileData.fileCaption
							});

						}

						ctrl.resetInput();
					});
				}
			});
		}
		controller.$inject = ['CommunityApiService'];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/fileupload/fileupload.html',
	        restrict: 'E ',
	        controllerAs: 'fileupload',
	        bindToController: true,
	        replace: true,
	        scope: {
	        	fileListModel: '=',
	        	onSuccessFn: '='
	        }
	    };

	    return directive;
	}
	communityFileUpload.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityFileUpload', communityFileUpload);
}(window._));