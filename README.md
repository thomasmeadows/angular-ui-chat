# Angular-UI-Chat
=========

A small library for making a chatroom.  This addon is purely front-end so how you send data to it be it sockets or standard request is up to you.

## Dependencies
  Angular 1.x

## Installation

  npm install angular-ui-chat --save

## Usage

  1. run npm install angular-ui-chat in the cli
  2. include the js file in your project
  3. Add 'ui-chat' to your angular dependencies
  4. Add to your html
  ```html
    <ui-chat options="uiChatOptions"></ui-chat>
  ```
  5. In your controller create an optionsObject
  ```javascript
    $scope.uiChatOptions = {
      messages: [message array]
    };
  ```

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

[VERSION.MD](VERSION.md)
