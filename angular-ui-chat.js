/* global angular */
(function (window, document) {
'use strict';
  angular.module('ui-chat', [])
  .directive('uiChat', function($log){
    return {
      restrict: 'E',
      controller: function($log, $scope) {
        $log.debug('io chat controller working', $scope.chatoptions);
        if($scope.chatoptions.usersListSide !== 'left' && $scope.chatoptions.usersListSide !== 'right'){
          $scope.chatoptions.usersListSide = right;
        }
        //set default chatoptions
      },
      scope: {
        chatoptions: '='
      },
      link: function(scope, ele, attrs, ctrl) {
        scope.chatoptions = scope.$eval(attrs.chatoptions);
        //set default chatoptions here

      },
      template: '<div class="ui-chat-main"><div class="ui-chat-users-left" ng-show="chatoptions.usersListSide===\'left\'"></div><div class="ui-chat-chat"></div><div class="ui-chat-users-right" ng-show="chatoptions.usersListSide===\'right\'"></div></div><div class="ui-chat-inputArea"><input type="text" class="chatInput"></div>'
    };
  });
})(window, document);
