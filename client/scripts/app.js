// store time stamp of last chat
var lastChatTimeStamp = 0;
var rooms = {};
var currentRoom = 'Lobby';


var getChats = function(data) {
  // loop through each item in data.results
  data.results.forEach(function(obj) {
    // if new room, add to select element
    if (!rooms.hasOwnProperty(obj.roomname)) {
      rooms[obj.roomname] = true;
      $('#roomSelect').append('<option>' + obj.roomname + '</option>');
    }

    console.log(currentRoom);
    // append each chat to the DOM in a div with a class of chats
    //sample timestamp: "2016-09-26T22:17:29.693Z"
    if (Date.parse(obj.createdAt) > lastChatTimeStamp) {
      if (currentRoom === 'Lobby') {
        app.renderMessage(obj);
      } else if (obj.roomname === currentRoom) {
        app.renderMessage(obj);
      }
    }
  });

  // reset lastChatTimeStamp to the latest chat
  lastChatTimeStamp = Date.parse(data.results[0].createdAt);
};

var app = {};

app.server = 'https://api.parse.com/1/classes/messages';

app.init = function() {};

app.send = function(data) {
  // clear chatroom
  app.clearMessages;

  // Grab the input node and extract the input value
  var inputText = $('input[name="chatInput"]').val();
  // POST
  data = data || {
    username: usernameParser(window.location.search),
    text: inputText,
    roomname: currentRoom
  };
  // $.post('https://api.parse.com/1/classes/messages', data, function() { alert('posted'); });
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function() { console.log('posted'); }
  });

  alert('created new chat: ' + currentRoom);
  
  //reset currentRoom

  // re-fetch the updated database
  app.fetch();
};

app.fetch = function() {
  // get request
  $.get('https://api.parse.com/1/classes/messages', getChats);
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(dataObject) {
  var nameDiv = '<div class="username">@' + dataObject.username + '</div>';
  var textDiv = '<div class="chat">' + dataObject.text + '</div>';
  // var roomDiv = '<div class="chat>' + dataObject.roomname + '</div>';
  $('#chats').append('<div class="chat">' + nameDiv + textDiv + '</div>');
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append('<option value=' + roomName + '>' + roomName + '</option>');
};

// // GET requests
setInterval(function() {
  app.fetch();
}, 1000);

// helper url parser for username
var usernameParser = function(parameters) {
  var index = parameters.indexOf('username=');
  return parameters.slice(index + 9);
};

var roomChange = function() {
  var text = $('#roomSelect option:selected').text();

  if (text === 'Create New Room') {
    result = window.prompt('Input new chat room name:', 'Ex: Panic Room');
    app.renderRoom(result);
    currentRoom = result;
    alert('created new room: ' + currentRoom);
  } else {
    currentRoom = text;
  }

  app.clearMessages();
  lastChatTimeStamp = 0;
  app.fetch();
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