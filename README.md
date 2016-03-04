# Angular-UI-Chat
=========

A small library for making a custom chatroom.  This addon is purely front-end so how you send data to it is up to you.

![chatdemo](https://cloud.githubusercontent.com/assets/11771776/13540000/0748f90c-e222-11e5-8eaf-880b9cd373f9.gif)

## Dependencies
  Angular 1.x

## Installation

  npm install angular-ui-chat --save

## Feature Roadmap

  - [x] Basic functionality (plain text)
  - [x] User Message Callback
  - [x] Curse Word Filters
  - [x] [Emoticons](http://www.emoji-cheat-sheet.com/)
  - [x] Mobile Friendly
  - [x] User Images
  - [x] Collapsable user name list
  - [x] Private Messages
  - [x] Admin abilities
  - [x] Parse on key up Emoticons/PM/Mention
  - [ ] User Settings
  - [ ] Custom User Levels
  - [ ] Themes
  - [ ] HTML - bold
  - [ ] HTML - underline
  - [ ] HTML - links
  - [ ] HTML - size increase
  - [ ] HTML - images

## Usage

  1. run npm install angular-ui-chat
  2. include the .min.js and the .min.css file from the dist/ folder in your project.
  3. Add 'ui-chat' to your angular dependencies
  4. Add to your html

  ```html

    <ui-chat chatoptions="uiChatOptions" chatmessage="messageCallbackFunction" chattyping="isTypingCallbackFunction" chatprivatemessage="chatPrivateMessageCallbackFunction" chatmessagedelete="messageDeleteCallbackFunction"></ui-chat>

  ```

  5. In your controller create an optionsObject and a message callback function (DO NOT include parenthesis () in the html!)

  ```javascript

    $scope.uiChatOptions = {
      //'left' or 'right'; defaults to right
      usersListSide: 'right',
      //if set to twa, the cha t will filter for twemoji awesome
      emoji: 'twa',
      curseFilter: true,
      //start this will parse items in the input box on key up
      mentionParse: true,
      emojiParse: true,
      pmParse: true,
      //end input box filters
      defaultCurseReplacer: '$|^&!',
      users: [arrayOfUsersInChat],
      user: {userObject},
      userFeedback: {
        message: 'soandso is typing a message',
      },
      messages: [messagesFromUsersInChat]
    };

    $scope.messageCallbackFunction = function(messageObject){
      //process message here whenever message received
      //you can also alter the message here and return the change
      return messageObject;
    };

    $scope.isTypingCallbackFunction = function(lengthOfCharacters){
      //process is activity here for user is typing...
    };

    $scope.chatPrivateMessageCallbackFunction = function(messageObject, userObject){
      //process message here whenever a private message is sent from the client user
      //you can also alter the message here and return the change
      return messageObject;
    };

    $scope.messageDeleteCallbackFunction = function(messageObject){
      //call for when an admin wants to delete a message
    };

  ```

  6. Each array is an array of objects, the following should be contained in each.  User is an object of the user that is the owner of the chat instance.  For security reasons it is not recommended to include user email addresses in calls related to chat functionality, this would leave anyone in the live chat open to having their emails scraped by a bot.

  ```javascript

    var arrayOfUsersInChat = [userObject, userObject];
    arrayOfUsersInChat.push(userObject);

  ```

  ```javascript

    var messagesFromUsersInChat = [];
    messagesFromUsersInChat.push({
      //the same userobject as listed below.
      user: {userObject},
      //the message sent
      message: 'message sent by user',
      id: 'unique id(optional)',
      //time of the messages
      time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      //if it is a private message
      private: {
        //who our client is having a conversation with
        user: userObject,
        //if the message is from the client to private user
        from: true,
        //if the message is to the client from private user
        to: true,
      },
    });

  ```

  ```javascript

    var userObject = {};
    userObject = {
      username: 'what to display',
      id: 'unique id(optional)',
      image: 'an image for the user',
      //if you want to use gravatar you should generate the links server side and pass it into this image field
      admin: false, // or true if they are a chat admin,
      //use left or right to display which side the users image should be on
      side: 'left'
    };

  ```

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Lint and test your code.  To build use grunt dist. To develop use grunt dev.  Use a different branch and send a pull request to contribute.

## About
  This project is sponsered by [ITProTV](http://www.itpro.tv/)

## Release History

[VERSION.MD](VERSION.md)
