/* global angular */
(function (window, document) {
'use strict';
  angular.module('uichatngenter', [])
  .directive('uiNgEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.uiNgEnter);
          });
          event.preventDefault();
        }
      });
    };
  });
  angular.module('ui-chat', ['uichatngenter'])
  .directive('uiChat', function($log){
    return {
      restrict: 'E',
      controller: function($log, $scope) {
        //$log.debug('ui-chat controller working');
        //set default chatoptions
        if($scope.chatoptions.usersListSide !== 'left' && $scope.chatoptions.usersListSide !== 'right'){
          $scope.chatoptions.usersListSide = right;
        }
        //end set default chatoptions

        //ui chat functions
        $scope.uiChatIsTyping = function(message){
          if(message.length > 3){
            $log.debug($scope.chatoptions.user.username,' is typing a message');
          }
        };

        $scope.uiChatMessageSent = function(message){
          $scope.chatoptions.messages.push({user: $scope.chatoptions.user, message: message});
          $scope.uiChatMessage = null;
        };
        //end ui chat functions
      },
      scope: {
        chatoptions: '='
      },
      link: function(scope, ele, attrs, ctrl) {
        scope.chatoptions = scope.$eval(attrs.chatoptions);
      },
      template:
      '<div class="ui-chat-main">' +
        '<div class="ui-chat-users"  ng-class="{\'ui-chat-users-left\':chatoptions.usersListSide===\'left\',\'ui-chat-users-right\':chatoptions.usersListSide===\'right\'}">' +
          '<div ng-repeat="user in chatoptions.users"><a class="ui-chat-username">{{user.username}}</a></div>' +
        '</div>' +
        '<div class="ui-chat-chat">' +
          '<div ng-repeat="message in chatoptions.messages" class="ui-chat-message">{{message.user.username}} - {{message.message}}</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="ui-chat-inputArea">' +
        '<input type="text" class="chatInput" ng-model="uiChatMessage" ng-change="uiChatIsTyping(uiChatMessage)" ui-ng-enter="uiChatMessageSent(uiChatMessage)">' +
      '</div>'
    };
  })

  ;
})(window, document);
