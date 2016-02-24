# Angular-UI-Chat
=========

A small library for making a custom chatroom.  This addon is purely front-end so how you send data to it is up to you.

## Dependencies
  Angular 1.x

## Installation

  npm install angular-ui-chat --save

## Feature Roadmap

  - [x] Basic functionality (plain text)
  - [x] User Message Callback
  - [x] Curse Word Filters
  - [x] [Emoticons](http://www.emoji-cheat-sheet.com/)
  - [ ] Gravatars
  - [ ] Mobile Friendly
  - [ ] User Settings
  - [ ] Admin abilities
  - [ ] Collapsable user name list
  - [ ] Private Messages
  - [ ] Custom User Levels
  - [ ] Themes
  - [ ] HTML - bold
  - [ ] HTML - underline
  - [ ] HTML - links
  - [ ] HTML - size increase
  - [ ] HTML - images

## Usage

  1. run npm install angular-ui-chat in the cli
  2. include the js and the less or css file in your project. Alternately copy the less/css file into your folders and create your own stylings
  3. Add 'ui-chat' to your angular dependencies
  4. Add to your html

  ```html

    <ui-chat chatoptions="uiChatOptions" chatmessage="messageCallbackFunction" chattyping="isTypingCallbackFunction"></ui-chat>

  ```

  5. In your controller create an optionsObject and a message callback function (DO NOT include parenthesis () in the html!)

  ```javascript

    $scope.uiChatOptions = {
      //'left' or 'right'; defaults to right
      usersListSide: 'right',
      //if set to twa, the chat will filter for twemoji awesome
      emoji: 'twa',
      curseFilter: true,
      users: [arrayOfUsersInChat],
      user: {userObject}
      defaultUserImage: 'default for no user image'
      messages: [messagesFromUsersInChat]
    };

    $scope.messageCallbackFunction = function(message){
      //process message here whenever message received
    };

    $scope.isTypingCallbackFunction = function(lengthOfCharacters){
      //process is activity here for user is typing...
    };

  ```

  6. Each array is an array of objects, the following should be contained in each.  User is an object of the user that is the owner of the chat instance.

  ```javascript

    var arrayOfUsersInChat = [];
    arrayOfUsersInChat.push({
      username: 'what to display',
      id: 'unique id, maybe from mongodb? this is optional, if its not included the username must be unique'
      image: 'an image for the user'
      admin: false // or true if they are a chat admin
    });

  ```

  ```javascript

    var messagesFromUsersInChat = [];
    messagesFromUsersInChat.push({
      //the same userobject as listed below.
      user: {userObject}
      //the message sent
      message: 'message sent by user'
    });

  ```

  ```javascript

    var userObject = {};
    userObject = {
      username: 'what to display',
      id: 'unique id, maybe from mongodb? this is optional, if its not included the username must be unique'
      image: 'an image for the user'
      admin: false // or true if they are a chat admin
    };

  ```

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code.  To build user grunt browserify.

## Release History

[VERSION.MD](VERSION.md)
