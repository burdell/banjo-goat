
'use strict';

require('directives/attachmentdisplay/attachmentdisplay.js');

var _ = require('underscore');

function communityFileUpload($timeout) {
	function link(scope, element, attrs) {
		var inputElement = element.find('input');
		var formElement = element.find('form');

		element.on('change', function(){
			scope.$apply(function(){
				scope.fileupload.upload(inputElement[0].files);
			})
		});

		scope.fileupload.resetInput = function(){
			formElement[0].reset();
		};
	}

	function removeUpload(fileIdentifier, fileList) {
		var fileIndex = _.findIndex(fileList, function(file) {
			return file.id === fileIdentifier;
		});

		if (fileIndex >= 0) {
			fileList.splice(fileIndex, 1);
		}
	}

	function controller(communityApi) {	
		var ctrl = this;
		_.extend(ctrl, {
			uploadingItems: [],
			upload: function(fileList){
				_.each(_.toArray(fileList), function(file, index){
					var fileIdentifier = file.name + index;
					ctrl.uploadingItems.push({ id: fileIdentifier, name: file.name });

					communityApi.Media.upload(file, ctrl.isAttachment).then(
						//success
						function(result){
							if (ctrl.onSuccessFn) {
								ctrl.onSuccessFn({
									fileUrl: result.url,
									fileName: file.name
								});
							} else {
								if (!ctrl.fileListModel) {
									ctrl.fileListModel = [];
								}
								
								var fileData = result;
								ctrl.fileListModel.push({
									fileUrl: fileData.url,
									fileCaption: fileData.fileCaption,
									fileName: fileData.meta.originalFilename
								});
							}
						})
					.finally(function(){
						removeUpload(fileIdentifier, ctrl.uploadingItems);
					});
					ctrl.resetInput();
			 	});
			}
		});
	}
	controller.$inject = [require('services/api.js')];
    
    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/fileupload/fileupload.html',
        restrict: 'E ',
        controllerAs: 'fileupload',
        bindToController: true,
        replace: true,
        scope: {
        	displayText: '@',
        	fileListModel: '=',
        	isAttachment: '=',
        	onSuccessFn: '='
        }
    };

    return directive;
}
communityFileUpload.$inject = ['$timeout'];

angular.module('community.directives')
	.directive('communityFileUpload', communityFileUpload);
