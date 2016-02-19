# Angular-UI-Chat
=========

A small library for making a chatroom.  This addon is purely front-end so how you send data to it be it sockets or standard request is up to you.

## Dependencies
  Angular 1.x

## Installation

  npm install angular-ui-chat --save

## Usage

  1. run npm install angular-ui-chat in the cli
  2. include the js and the less or css file in your project. Alternately copy the less/css file into your folders and create your own stylings
  3. Add 'ui-chat' to your angular dependencies
  4. Add to your html

  ```html

    <ui-chat chatoptions="uiChatOptions"></ui-chat>

  ```

  5. In your controller create an optionsObject

  ```javascript

    $scope.uiChatOptions = {
      //'left' or 'right'; defaults to right
      usersListSide: 'right',
      users: [arrayOfUsersInChat],
      defaultUserImage: 'default for no user image'
      messages: [messagesFromUsersInChat]
    };

  ```

  6. Each array is an array of objects, the following should be contained in each.

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
      //username or id required
      username: 'what is displayed, same as above',
      //or//
      id: 'unique id, maybe from mongodb.  otherwise you can use a unique user name'
      //username or id required
      message: 'message sent by user'
    });

  ```

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

[VERSION.MD](VERSION.md)
