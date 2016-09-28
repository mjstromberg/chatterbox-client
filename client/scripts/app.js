// store time stamp of last chat
var lastChatTimeStamp = 0;
var rooms = {};
var currentRoom = 'Lobby';


var getChats = function(data) {
  // clear chatroom
  app.clearMessages();

  // loop through each item in data.results
  data.results.forEach(function(obj) {
    // if new room, add to select element
    if (!rooms.hasOwnProperty(obj.roomname)) {
      rooms[obj.roomname] = true;
      $('#roomSelect').append('<option>' + obj.roomname + '</option>');
    }

    // append each chat to the DOM in a div with a class of chats
    // if (Date.parse(obj.createdAt) > lastChatTimeStamp) {
    if (currentRoom === 'Lobby') {
      app.renderMessage(obj);
    } else if (obj.roomname === currentRoom) {
      app.renderMessage(obj);
    }
    
  });

  // reset lastChatTimeStamp to the latest chat
  lastChatTimeStamp = Date.parse(data.results[0].createdAt);
};

var app = {
  init: function() {
    // variables
    app.friendsList = {};

    // listeners
    $('#chatForm').submit(function(event) {
      app.send();
      event.preventDefault();
    });

    $('body').on('click', '.username', function(event) {
      var friendUsername = event.target.textContent.slice(1);
      app.addFriend(friendUsername);
    });



    // GET requests
    setInterval(function() {
      app.fetch();
    }, 1000);
  },

  server: 'https://api.parse.com/1/classes/messages',

  send: function(data) {
    // Grab the input node and extract the input value
    var inputText = $('input[name="chatInput"]').val();
    // POST
    data = data || {
      username: app.usernameParser(window.location.search),
      text: inputText,
      roomname: currentRoom
    };

    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function() {
        app.fetch();
      }
        
    });
  },

  fetch: function() {
    // get request
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: getChats
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function(dataObject) {
    var $chat = $('<div class="chat"></div>');
    var $username = $('<div class="username"></div>');
    var $text = $('<div class="chat"></div>');

    $username.text('@' + dataObject.username).appendTo($username);
    $text.text(dataObject.text).appendTo($text);
    $chat.append($username, $text);

    if (dataObject.username in app.friendsList) {
      $chat.css('font-weight', 'bold');
    }

    $('#chats').append($chat);
  },

  renderRoom: function(roomName) {
    $('#roomSelect').append('<option value=' + roomName + '>' + roomName + '</option>');
  },

  usernameParser: function(parameters) {
    var index = parameters.indexOf('username=');
    return parameters.slice(index + 9);
  },

  roomChange: function() {
    var text = $('#roomSelect option:selected').text();

    if (text === 'Create New Room') {
      result = window.prompt('Input new chat room name:', 'Ex: Panic Room');
      app.renderRoom(result);
      currentRoom = result;
    } else {
      currentRoom = text;
    }

    app.clearMessages();
    lastChatTimeStamp = 0;
    app.fetch();
  },

  addFriend: function(username) {
    app.friendsList[username] = true;
    console.log(app.friendsList);
  }
};

/* PLAN

- Implement room functionality
  x Populate select element with current rooms
  - Add create room functionality
    x Add room to database of rooms
    - After creating new room, switch selected room to the new room name
    - After creating new room, point 'select' to the correct 'option' (maybe)
    x Update POSTs to have the correct roomname
  x Filter chats by room property
    x Set a global variable called currentRoom (default is Lobby)
    x Refactor getChats to filter for the proper room
    x On roomChange
      x clearMessages
      x set currentRoom to text
      x reset lastChatTimeStamp
      x call app.fetch
- Create our XSS attack filter thingy
- Add friend
- Send message upon clicking submit


*/