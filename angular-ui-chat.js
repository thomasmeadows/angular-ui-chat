/* global angular */
(function (window, document) {
'use strict';
  angular.module('ui-chat', [])
  .directive('uiChat', function($log){
    return {
      restrict: 'E',
      controller: function($log) {
        //$log.debug('io chat controller working');
      },
      link: function(scope, ele, attrs, ctrl) {
        var options = scope.$eval(attrs.options);
        //$log.debug('options',options);
      }
    };
  });
})(window, document);
