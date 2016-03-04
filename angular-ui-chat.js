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
  .directive('uiChatScrollBottom', function () {
    return {
      scope: {
        uiChatScrollBottom: "="
      },
      link: function (scope, element) {
        scope.$watchCollection('uiChatScrollBottom', function (newValue) {
          if (newValue)
          {
            element[0].scrollTop = element[0].scrollHeight;
          }
        });
      }
    };
  })
  .directive('uiChatCaret', function($log) {

    function getPos(element) {
      if ('selectionStart' in element) {
        return element.selectionStart;
      } else if (document.selection) {
        element.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -element.value.length);
        return sel.text.length - selLen;
      }
    }

    function setPos(element, caretPos) {
      var range;
      if (element.createTextRange) {
        range = element.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else if (element.setSelectionRange) {
        element.focus();
        element.setSelectionRange(caretPos, caretPos);
      }else {
        element.focus();
        var el = document.getElementById("ui-chat-input-id");
        range = document.createRange();
        var sel = window.getSelection();
        $log.debug('el', el.childNodes[0]);
        $log.debug('el len', el.childNodes.length);
        range.setStart(el.childNodes[el.childNodes.length-1], 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    return {
      restrict: 'A',
      scope: {
        uiChatCaret: '=',
      },
      link: function(scope, element, attrs) {
        if (!scope.uiChatCaret) scope.uiChatCaret = {};

        element.on('keydown keyup click', function(event) {
          scope.$apply(function() {
            scope.uiChatCaret.get = getPos(element[0]);
          });
          if(element[0] && element.html().indexOf(' cursorend') > -1){
            element.html(element.html().replace('cursorend=""','').replace('cursorend="true"','').replace('cursorend',''));
            setPos(element[0], element.html().length);
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


        //functions used for sedning messages
        var curseFilter = function(message){
          var splitWord = message.split(' ');
          var newMessage = '';
          var replaceWord = '$|^&!';
          if($scope.chatoptions.defaultCurseReplacer){
            replaceWord = $scope.chatoptions.defaultCurseReplacer;
          }

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
              message = message.replace(emojiArray[i], '<i contenteditable="false" class="ui-chat-emoji-insert twa twa-' + emojiArray[i].replace(':','').replace(':','').replace('_','-').replace('_','-').replace('_','-') + '"></i><span  contenteditable="true" cursorend> </span>');
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

        //ui chat functions
        $scope.usernameClicked = function(userObject){
          $scope.privateMessageUser = userObject;
          //if the user has not typed any message
          if(!$scope.uiChatMessage){
            $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false">@' + userObject.username + '</span><span contenteditable="true"> </span>';
          //if the user has a
          }else if($scope.uiChatMessage && $scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') !== 0){
            $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false">@' + userObject.username + '</span><span contenteditable="true"> </span>' + $scope.uiChatMessage;
          //if the user is click a user after already clicking one
          }else if($scope.uiChatMessage && $scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') === 0){
            $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false">@' + userObject.username + "</span>" + $scope.uiChatMessage.slice( ($scope.uiChatMessage.indexOf('</span>')+7));
          }
        };

        $scope.uiChatIsTyping = function(message){
          if($scope.uiChatMessage.length > 20){
            //if the user starts typing before a private message box
            if($scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') > 0){
              //delete what they type
              $scope.uiChatMessage = message.slice($scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@'));
            }
          }
          if($scope.uiChatMessage.length > 3){
            //if emoji chat options set to 'twa'
            //and it has a semicolon
            //and 2nd semicolon exist
            if($scope.chatoptions.emojiParse && $scope.chatoptions.emoji === 'twa' && message.indexOf(':') > -1 && message.lastIndexOf(':') !== message.indexOf(':')){
              //call the funciton to convert emojis
              $scope.uiChatMessage = convertEmoji($scope.uiChatMessage);
            }
            if($scope.chatoptions.mentionParse || $scope.chatoptions.pmParse){
              var atIndex = $scope.uiChatMessage.indexOf('@');
              var spaceIndex = $scope.uiChatMessage.indexOf('&nbsp;');
              var lastSpaceIndex = $scope.uiChatMessage.lastIndexOf('&nbsp;');
              if(atIndex > -1){
                if(scope.chatoptions.pmParse && atIndex === 0 && spaceIndex > 0){
                  var username =  $scope.uiChatMessage.substr(atIndex+ 1,spaceIndex-1);
                  for (var i = 0; i < $scope.chatoptions.users.length; i++) {
                    if($scope.chatoptions.users[i].username === username){
                      $scope.privateMessageUser = $scope.chatoptions.users[i];
                      i = $scope.chatoptions.users.length;
                    }
                  }
                  if(!$scope.privateMessageUser){
                    $scope.privateMessageUser = {
                      username: username
                    };
                  }
                  $scope.uiChatMessage = '<span class="ui-chat-input-pm-username" contenteditable="false" cursorend>@' + username + "</span>" + $scope.uiChatMessage.slice( (spaceIndex));
                }else if($scope.chatoptions.mentionParse && lastSpaceIndex && lastSpaceIndex > atIndex){
                  var mentionStart = $scope.uiChatMessage.slice(atIndex+1);
                  var mentionFirstSpace = mentionStart.indexOf('&nbsp;');
                  var usermention;
                  if(mentionFirstSpace > 0){
                    usermention = mentionStart.substr(0, mentionFirstSpace);
                    for (var z = 0; z < $scope.chatoptions.users.length; z++) {
                      if($scope.chatoptions.users[z].username === usermention){
                        $scope.messageMentionUser = $scope.chatoptions.users[z];
                        z = $scope.chatoptions.users.length;
                      }
                    }
                    if(!$scope.messageMentionUserr){
                      $scope.messageMentionUser = {
                        username: usermention
                      };
                    }
                    if($scope.uiChatMessage.indexOf('<span class="ui-chat-input-mention" contenteditable="false"') === -1){
                      $scope.uiChatMessage = $scope.uiChatMessage.replace('@' + usermention,'<span class="ui-chat-input-mention" contenteditable="false" cursorend>@' + usermention + "</span>&nbsp;");
                    }
                  }
                }
              }
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

          //set up variables for message being sent
          var newMessageObject = false;
          var privateObject = false;
          var messageObject = {};
          //end area for set up

          //if emoji chat options set to 'twa'
          //and it has a semicolon
          //and 2nd semicolon exist
          if($scope.chatoptions.emoji === 'twa' && message.indexOf(':') > -1 && message.lastIndexOf(':') !== message.indexOf(':')){
            //call the funciton to convert emojis
            $scope.uiChatMessage = convertEmoji($scope.uiChatMessage);
          }
          //if the curse filter is turned on
          if($scope.chatoptions.curseFilter){
            $scope.uiChatMessage = curseFilter($scope.uiChatMessage);
          }

          //set some defaults for the messageObject
          messageObject.user = $scope.chatoptions.user;
          messageObject.message = $scope.uiChatMessage;
          messageObject.time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();

          //if this is a private message
          if($scope.privateMessageUser && $scope.uiChatMessage.indexOf('<span class="ui-chat-input-pm-username" contenteditable="false">@') === 0){
            $scope.uiChatMessage = $scope.uiChatMessage.slice( ($scope.uiChatMessage.indexOf('</span>')+7));
            messageObject.message = $scope.uiChatMessage;
            //if the user is sending a private message define it as part of the message
            messageObject.private = {
              user: $scope.privateMessageUser,
              from: true
            };
            //if the developer has defined a chatprivatemessage callback
            if($scope.chatprivatemessage()){
              newMessageObject = $scope.chatprivatemessage()(messageObject, $scope.privateMessageUser);
            }else{
              $log.warn('ui.chat chatprivatemessage function is not defined in html');
            }
          //if this is a public message
          }else{
            //if the developer has defined a chatmessage callback
            if($scope.chatmessage()){
              newMessageObject = $scope.chatmessage()(messageObject);
            }else{
              $log.warn('ui.chat chatmessage function is not defined in html');
            }

          }

          //if the developer has sent us modifications to the message object
          if(newMessageObject){
            messageObject.message = newMessageObject.message;
          }

          //push the message to array
          $scope.chatoptions.messages.push(messageObject);
          //reset the input box to null so user can type a new message later
          $scope.uiChatMessage = null;

        };

        $scope.deleteMessageClicked = function(messageObject, index){
          if($scope.chatmessagedelete()){
            $scope.chatmessagedelete()(messageObject);
          }
          $scope.chatoptions.messages.splice(index, 1);
        };

        //end ui chat functions
      },
      scope: {
        //helps pass in functions and objects to controller
        chatoptions: '=',
        chatmessage: '&',
        chattyping: '&',
        chatmessagedelete: '&',
        chatprivatemessage: '&',
      },
      link: function(scope, ele, attrs, ctrl) {
        //turns the object passed in into an object to be used in controller
        scope.chatoptions = scope.$eval(attrs.chatoptions);
      },
      template:
      '<div class="ui-chat-main">' +
        '<div class="ui-chat-users"  ng-class="{left:chatoptions.usersListSide===\'left\',right:chatoptions.usersListSide===\'right\', collapsed: uiChatUsersCollapsed}">' +
          '<div class="ui-chat-user" ng-repeat="user in chatoptions.users">'+
            '<img class="ui-chat-userimage" ng-if="user.image" src="{{user.image}}">' +
            '<a class="ui-chat-username" ng-click="usernameClicked(user)">{{user.username}}</a>'+
          '</div>' +
        '</div>' +
        '<div class="ui-chat-chat" ng-class="{collapsed: uiChatUsersCollapsed}" ui-chat-scroll-bottom="chatoptions.messages">' +
          '<div ng-repeat="message in chatoptions.messages" class="ui-chat-message">' +
            '<div ng-show="message.user.image">' +
              '<img class="ui-chat-message-user-image" src="{{message.user.image}}" ng-class="{left: (message.user.side === \'left\' || !message.user.side), right:  message.user.side === \'right\'}">' +
              '<img class="ui-chat-message-user-image" ng-if="message.private" src="{{message.private.user.image}}" ng-class="{left: (message.user.side === \'right\' || !message.user.side), right:  message.user.side === \'left\'}">' +
              '<div class="ui-chat-message-outer"  ng-class="{left: (message.user.side === \'left\' || !message.user.side || message.private), right:  message.user.side === \'right\' || message.private}">' +
                '<div class="triangle-left" ng-show="message.user.side === \'left\' || message.private"></div>' +
                '<div class="triangle-right" ng-show="message.user.side === \'right\' || message.private"></div>' +
                '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.user)">{{message.user.username}}</a>' +
                '<span class="ui-chat-message-time" ng-show="message.time">' +
                  '{{message.time}}'+
                '</span>' +
                '<span ng-if="message.private.user.username">' +
                  '<span ng-show="message.private.to"> &nbsp;&lt;&nbsp;</span>' +
                  '<span ng-show="message.private.from">&nbsp;&gt;&nbsp;</span>' +
                  '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.private.user)">{{message.private.user.username}}</a>' +
                '</span>' +
                '<div class="ui-chat-message-inner" ng-bind-html="message.message"></div>'+
                '<button class="ui-chat-delete-button" ng-show="chatoptions.user.admin" ng-click="deleteMessageClicked(message, $index)">' +
                  'delete'+
                '</button>' +
              '</div>' +
            '</div>' +
            '<div ng-hide="message.user.image">' +
              '<div class="ui-chat-message-outer">' +
                '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.user)">{{message.user.username}}</a>' +
                '<span class="ui-chat-message-time" ng-show="message.time">' +
                  '{{message.time}}'+
                '</span>' +
                '<span ng-if="message.private.user.username">' +
                  '<span ng-show="message.private.to">&nbsp;&lt;&nbsp;</span>' +
                  '<span ng-show="message.private.from">&nbsp;&gt;&nbsp;</span>' +
                  '<a class="ui-chat-message-inner-username"    ng-click="usernameClicked(message.private.user)">{{message.private.user.username}}</a>' +
                '</span>' +
                '<button class="ui-chat-delete-button" ng-show="chatoptions.user.admin" ng-click="deleteMessageClicked(message, $index)">' +
                  'delete'+
                '</button>' +
                '<div class="ui-chat-message-inner" ng-bind-html="message.message"></div>'+
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="ui-chat-collapse-button"  ng-hide="uiChatUsersCollapsed" ng-click="uiChatUsersCollapsed = !uiChatUsersCollapsed" ng-class="{left:chatoptions.usersListSide===\'left\',right:chatoptions.usersListSide===\'right\'}"><span class="ui-chat-collapse-button-inner"></span></button>' +
      '<button class="ui-chat-uncollapse-button" ng-class="{left:chatoptions.usersListSide===\'left\',right:chatoptions.usersListSide===\'right\'}"  ng-show="uiChatUsersCollapsed" ng-click="uiChatUsersCollapsed = !uiChatUsersCollapsed"><span class="ui-chat-uncollapse-button-inner"></span></button>' +
      '<div class="ui-chat-inputArea">' +
        '<div id="ui-chat-input-id" contenteditable="true" class="chatInput" ng-model="uiChatMessage" ui-chat-caret="uiChatCaret" ng-change="uiChatIsTyping(uiChatMessage)" ui-ng-enter="uiChatMessageSent(uiChatMessage)"></div>' +
        '<a href="http://www.emoji-cheat-sheet.com/" ng-if="chatoptions.emoji" target="_blank"><i class="twa ui-chat-emoticon"></i></a>' +
      '</div>' +
      '<div class="ui-chat-feedback" ng-show="chatoptions.userFeedback.message">' +
        '{{chatoptions.userFeedback.message}}' +
      '</div>'
    };
  })

  ;
})(window, document);
