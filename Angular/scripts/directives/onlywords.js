'use strict';

/**
 * @ngdoc directive
 * @name docubasic3App.directive:onlyWords
 * @description
 * # onlyWords
 */
angular.module('material')
  .directive('onlyWords', function () {
    return {

    	require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^a-z,A-Z]/g, '');
        //console.log(transformedInput);
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;
      }
      ngModelCtrl.$parsers.push(fromUser);

      }
    };
  })
  .directive('onlyDigits', function () {
    return {
       require: 'ngModel',
       link: function (scope, element, attr, ngModelCtrl) {
           function fromUser(text) {
               if (text) {
                   var transformedInput = text.replace(/[^0-9]/g, '');

                   if (transformedInput !== text) {
                       ngModelCtrl.$setViewValue(transformedInput);
                       ngModelCtrl.$render();
                   }
                   return transformedInput;
               }
               return undefined;
           }
           ngModelCtrl.$parsers.push(fromUser);
       }
   };
  }).directive('ngThumb', ['$window', function($window) {
      var helper = {
          support: !!($window.FileReader && $window.CanvasRenderingContext2D),
          isFile: function(item) {
              return angular.isObject(item) && item instanceof $window.File;
          },
          isImage: function(file) {
              var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
          }
      };

      return {
          restrict: 'A',
          template: '<canvas/>',
          link: function(scope, element, attributes) {
              if (!helper.support) return;

              var params = scope.$eval(attributes.ngThumb);

              if (!helper.isFile(params.file)) return;
              if (!helper.isImage(params.file)) return;

              var canvas = element.find('canvas');
              var reader = new FileReader();

              reader.onload = onLoadFile;
              reader.readAsDataURL(params.file);

              function onLoadFile(event) {
                  var img = new Image();
                  img.onload = onLoadImage;
                  img.src = event.target.result;
              }

              function onLoadImage() {
                  var width = params.width || this.width / this.height * params.height;
                  var height = params.height || this.height / this.width * params.width;
                  canvas.attr({ width: width, height: height });
                  canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
              }
          }
      };
  }]);
