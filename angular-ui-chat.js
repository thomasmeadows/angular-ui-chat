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
      template:
      '<div class="ui-chat-main">' +
        '<div class="ui-chat-users"  ng-class="{\'ui-chat-users-left\':chatoptions.usersListSide===\'left\',\'ui-chat-users-right\':chatoptions.usersListSide===\'right\'}">' +
          '<div ng-repeat="user in chatoptions.users" class="username"><a>{{user.username}}</a></div>' +
        '</div>' +
        '<div class="ui-chat-chat">' +

        '</div>' +
      '</div>' +
      '<div class="ui-chat-inputArea">' +
        '<input type="text" class="chatInput">' +
      '</div>'
    };
  });
})(window, document);
