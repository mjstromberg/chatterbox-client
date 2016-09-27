// store time stamp of last chat
var lastChatTimeStamp = 0;

var getChats = function(data) {
  console.log(data);
  var lastNewChatFound = false;

  // loop through each item in data.results
  data.results.forEach(function(obj) {
    // append each chat to the DOM in a div with a class of chats

    //sample timestamp: "2016-09-26T22:17:29.693Z"
    if (Date.parse(obj.createdAt) > lastChatTimeStamp) {
      var nameDiv = '<div class="username">@' + obj.username + '</div>';
      var textDiv = '<div class="chat">' + obj.text + '</div>';
      $('#chats').append('<div class="chat">' + nameDiv + textDiv + '</div>');
    }
  });

  // reset lastChatTimeStamp to the latest chat
  lastChatTimeStamp = Date.parse(data.results[0].createdAt);
};

// GET requests
setInterval(function() {
  $.get('https://api.parse.com/1/classes/messages', getChats);
}, 1000);

// POST requests
// On submit button click
  // Example:
  // $("button").click(function(){
    // $.post("demo_test_post.asp",
    // {
    //   name: "Donald Duck",
    //   city: "Duckburg"
    // },
    // function(data,status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });
  // });

// helper url parser for username
var usernameParser = function(parameters) {
  var index = parameters.indexOf('username=');
  return parameters.slice(index + 9);
};

var postChat = function() {
  // Grab the input node and extract the input value
  var inputText = $('input[name="chatInput"]').val();
  // POST
  var data = {
    username: usernameParser(window.location.search),
    text: inputText,
    roomname: 'blank'
  };
  // $.post('https://api.parse.com/1/classes/messages', data, function() { alert('posted'); });
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function() { alert('posted'); }
  });
};

/* PLAN

x Build a div to hold all of our chats
- Build structure to get, post, put, etc. to the server
  x Build ajax get request using jquery
  x Append chats to our chats div
  x Set up an interval to grab new chats from the server/database
  x Build HTML for our form input field
  x Build a submit button
  x Define callback function for ajax post request
  x Build ajax post request using jquery
  x Set up button and on click functionality to post the post request
- Build security checks


*/