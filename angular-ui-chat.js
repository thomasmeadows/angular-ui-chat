/* global angular */
(function (window, document) {
'use strict';
  angular.module('uichatdeps', [])
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
  })
  .directive('uiScrollBottom', function ($log) {
    return {
      scope: {
        uiScrollBottom: "="
      },
      link: function (scope, element) {
        scope.$watchCollection('uiScrollBottom', function (newValue) {
          if (newValue)
          {
            element[0].scrollTop = element[0].scrollHeight;
          }
        });
      }
    };
  })
  .directive("contenteditable", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {

        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function() {
          element.html(ngModel.$viewValue || "");
        };

        element.bind("blur keyup change", function() {
          scope.$apply(read);
        });
      }
    };
  });
  angular.module('ui-chat', ['uichatdeps'])
  .directive('uiChat', function($log){
    return {
      restrict: 'E',
      controller: function($log, $scope) {
        if($scope.chatoptions.emoji === 'twa'){
          if(require){
            var emojiArray = require('./emoji.json');
          }else{
            throw 'require unavailable you need browserify or a way to import json';
          }
        }
        if($scope.chatoptions.curseFilter){
          if(require){
            var curseWordArray = require('./cursewords.json');
          }else{
            throw 'require unavailable you need browserify or a way to import json';
          }
        }

        //$log.debug('ui-chat controller working');
        //set default chatoptions
        if($scope.chatoptions.usersListSide !== 'left' && $scope.chatoptions.usersListSide !== 'right'){
          $scope.chatoptions.usersListSide = right;
        }
        //end set default chatoptions

        //ui chat functions
        $scope.uiChatIsTyping = function(message){
          if($scope.uiChatMessage.length > 1){
            //if the user starts typing before a private message box
            if($scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') > 0){
              //delete what they type
              $scope.uiChatMessage = message.slice($scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@'));
            }
          }
          //send the message length to the coder
          if($scope.chattyping){
            $scope.chattyping()(message.length);
          }else{
            $log.info('ui.chat chattyping is not defined in html');
            return;
          }

        };

        $scope.uiChatMessageSent = function(message){
          //functions used for sedning messages
          var curseFilter = function(message){
            var splitWord = message.split(' ');
            var newMessage = '';
            var replaceWord = '$|^&!';
            for (var x = 0; x < splitWord.length; x++) {
              for (var i = 0; i < curseWordArray.length; i++) {
                if(splitWord[x] === curseWordArray[i]){
                  splitWord[x] = replaceWord;
                }
              }
              //if there is another word after this
              if(splitWord[x+1]){
                newMessage += splitWord[x] + ' ';
              //if this is the last word
              }else{
                newMessage += splitWord[x];
              }

            }
            return newMessage;
          };

          var convertEmoji = function(message){
            for (var i = 0; i < emojiArray.length; i++) {
              if(message.indexOf(emojiArray[i]) > -1){
                $log.debug('replacing emoji - ' + message);
                message = message.replace(emojiArray[i], '<i class="twa twa-' + emojiArray[i].replace(':','').replace(':','').replace('_','-').replace('_','-').replace('_','-') + '"></i>');
                $log.debug('replaced emoji - ' + message);
                //start over the search if there are still :
                if($scope.chatoptions.emoji === 'twa' && message.indexOf(':') > -1 && message.lastIndexOf(':') !== message.indexOf(':')){
                  i = 0;
                }else{
                  //exit if there is no : in message
                  i = emojiArray.length;
                }
              }
            }
            return message;
          };
          //end functions used for sending Messages

          //send unaltered message to coder;
          var newMessage;
          var privateObject = false;
          if($scope.chatmessage()){
            //if this is a private message
            if($scope.privateMessageUser && $scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') === 0){
              $scope.uiChatMessage = $scope.uiChatMessage.slice( ($scope.uiChatMessage.indexOf('</span>')+7));
              message = $scope.uiChatMessage;
              privateObject = {user: $scope.privateMessageUser, from: true};
              if($scope.chatprivatemessage()){
                newMessage = $scope.chatprivatemessage()($scope.uiChatMessage, $scope.privateMessageUser);
              }else{
                $log.warn('ui.chat chatprivatemessage function is not defined in html');
              }
            //if this is a public message
            }else{
              newMessage = $scope.chatmessage()(message);
            }
            if(newMessage){
              $scope.uiChatMessage = newMessage;
              message = newMessage;
            }
          }else{
            $log.warn('ui.chat chatmessage function is not defined in html');
          }
          //end area to send ulaltered message

          //if emoji chat options set to 'twa'
          //and it has a semicolon
          //and 2nd semicolon exist
          if($scope.chatoptions.emoji === 'twa' && message.indexOf(':') > -1 && message.lastIndexOf(':') !== message.indexOf(':')){
            //call the funciton to convert emojis
            message = convertEmoji(message);
          }
          //if the curse filter is turned on
          if($scope.chatoptions.curseFilter){
            message = curseFilter(message);
          }
          //push the message to array
          $scope.chatoptions.messages.push({user: $scope.chatoptions.user, message: message, private: privateObject});
          //reset the input box to null so user can type a new message later
          $scope.uiChatMessage = null;

        };

        $scope.usernameClicked = function(userObject){
          $scope.privateMessageUser = userObject;
          //if the user has not typed any message
          if(!$scope.uiChatMessage){
            $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false">@' + userObject.username + "</span><span></span>";
          //if the user has a
          }else if($scope.uiChatMessage && $scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') !== 0){
            $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false">@' + userObject.username + "</span><span></span>" + $scope.uiChatMessage;
          //if the user is click a user after already clicking one
          }else if($scope.uiChatMessage && $scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') === 0){
            $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false">@' + userObject.username + "</span>" + $scope.uiChatMessage.slice( ($scope.uiChatMessage.indexOf('</span>')+7));
          }
        };

        //end ui chat functions
      },
      scope: {
        //helps pass in functions and objects to controller
        chatoptions: '=',
        chatmessage: '&',
        chattyping: '&',
        chatprivatemessage: '&',
      },
      link: function(scope, ele, attrs, ctrl) {
        //turns the object passed in into an object to be used in controller
        scope.chatoptions = scope.$eval(attrs.chatoptions);
      },
      template:
      '<div class="ui-chat-main">' +
        '<div class="ui-chat-users"  ng-class="{left:chatoptions.usersListSide===\'left\',right:chatoptions.usersListSide===\'right\', collapsed: uiChatUsersCollapsed}">' +
          '<div ng-repeat="user in chatoptions.users"><a class="ui-chat-username" ng-click="usernameClicked(user)">{{user.username}}</a></div>' +
        '</div>' +
        '<div class="ui-chat-chat" ng-class="{collapsed: uiChatUsersCollapsed}" ui-scroll-bottom="chatoptions.messages">' +
          '<div ng-repeat="message in chatoptions.messages" class="ui-chat-message">' +
            '<div ng-show="message.user.image">' +
              '<img class="ui-chat-message-user-image" src="{{message.user.image}}" ng-class="{left: (message.user.side === \'left\' || !message.user.side), right:  message.user.side === \'right\'}">' +
              '<img class="ui-chat-message-user-image" ng-if="message.private" src="{{message.private.user.image}}" ng-class="{left: (message.user.side === \'right\' || !message.user.side), right:  message.user.side === \'left\'}">' +
              '<div class="ui-chat-message-outer"  ng-class="{left: (message.user.side === \'left\' || !message.user.side || message.private), right:  message.user.side === \'right\' || message.private}">' +
                '<div class="triangle-left" ng-show="message.user.side === \'left\' || message.private"></div>' +
                '<div class="triangle-right" ng-show="message.user.side === \'right\' || message.private"></div>' +
                '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.user)">{{message.user.username}}</a>'+
                '<span ng-if="message.private.user.username">'+
                  '<span ng-show="message.private.to"> &nbsp;&lt;&nbsp;</span>' +
                  '<span ng-show="message.private.from">&nbsp;&gt;&nbsp;</span>' +
                  '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.private.user)">{{message.private.user.username}}</a>'+
                '</span>' +
                '<div class="ui-chat-message-inner" ng-bind-html="message.message"></div>'+
              '</div>' +
            '</div>' +
            '<div ng-hide="message.user.image">' +
              '<div class="round-border">'+
                '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.user)">{{message.user.username}}</a>'+
                '<span ng-if="message.private.user.username">'+
                  '<span ng-show="message.private.to">&nbsp;&lt;&nbsp;</span>' +
                  '<span ng-show="message.private.from">&nbsp;&gt;&nbsp;</span>' +
                  '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.private.user)">{{message.private.user.username}}</a>'+
                '</span>' +
                '<div class="ui-chat-message-inner" ng-bind-html="message.message"></div>'+
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="collapse-button" ng-hide="uiChatUsersCollapsed" ng-click="uiChatUsersCollapsed = !uiChatUsersCollapsed"><span class="collapse-button-inner"></span></button>' +
      '<button class="uncollapse-button" ng-show="uiChatUsersCollapsed" ng-click="uiChatUsersCollapsed = !uiChatUsersCollapsed"><span class="uncollapse-button-inner"></span></button>' +
      '<div class="ui-chat-inputArea">' +
        '<div contenteditable="true" class="chatInput" ng-model="uiChatMessage" ng-change="uiChatIsTyping(uiChatMessage)" ui-ng-enter="uiChatMessageSent(uiChatMessage)"></div>' +
        '<a href="http://www.emoji-cheat-sheet.com/" ng-if="chatoptions.emoji" target="_blank"><i class="twa twa-my-emoticon"></i></a>' +
      '</div>'
    };
  })

  ;
})(window, document);
