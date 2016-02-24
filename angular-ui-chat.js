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
          if(message.length > 1){
            $log.debug($scope.chatoptions.user.username,' is typing a message');
          }
          if($scope.chattyping){
            $scope.chattyping()(message.length);
          }else{
            $log.info('ui.chat chattyping is not defined in html');
            return;
          }

        };

        $scope.uiChatMessageSent = function(message){
          //send unaltered message;
          if($scope.chatmessage()){
            var newMessage = $scope.chatmessage()(message);
            if(newMessage){
              message = newMessage;
            }
          }else{
            $log.info('ui.chat chatmessage is not defined in html');
            return;
          }
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
          $scope.chatoptions.messages.push({user: $scope.chatoptions.user, message: message});
          //reset the input box to null so user can type a new message later
          $scope.uiChatMessage = null;

        };

        //end ui chat functions
      },
      scope: {
        //helps pass in functions and objects to controller
        chatoptions: '=',
        chatmessage: '&',
        chattyping: '&'
      },
      link: function(scope, ele, attrs, ctrl) {
        //turns the object passed in into an object to be used in controller
        scope.chatoptions = scope.$eval(attrs.chatoptions);
      },
      template:
      '<div class="ui-chat-main">' +
        '<div class="ui-chat-users"  ng-class="{\'ui-chat-users-left\':chatoptions.usersListSide===\'left\',\'ui-chat-users-right\':chatoptions.usersListSide===\'right\'}">' +
          '<div ng-repeat="user in chatoptions.users"><a class="ui-chat-username">{{user.username}}</a></div>' +
        '</div>' +
        '<div class="ui-chat-chat" ui-scroll-bottom="chatoptions.messages">' +
          '<div ng-repeat="message in chatoptions.messages" class="ui-chat-message">{{message.user.username}} <span class="triangle-border left" ng-bind-html="message.message"></span></a></div>' +
        '</div>' +
      '</div>' +
      '<div class="ui-chat-inputArea">' +
        '<input type="text" class="chatInput" ng-model="uiChatMessage" ng-change="uiChatIsTyping(uiChatMessage)" ui-ng-enter="uiChatMessageSent(uiChatMessage)">' +
        '<a href="http://www.emoji-cheat-sheet.com/" ng-if="chatoptions.emoji" target="_blank"><i class="twa twa-my-emoticon"></i></a>' +
      '</div>'
    };
  })

  ;
})(window, document);
