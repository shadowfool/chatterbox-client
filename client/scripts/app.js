// YOUR CODE HERE:

///hacking ideas:
// put stuff in the user name
//request username hack

  var app = {
    server:"https://api.parse.com/1/classes/messages",
    init: function(name) {
      console.log('init called' + Array.prototype.slice.call(arguments));
      console.log(name);
    },
    send: function(message) {
      $.ajax({
        type:'POST',
        url: app.server,
        data: JSON.stringify(message),
        success: function() {
          console.log('success');
        },
        error: function(errMessage) {
          console.log('error');
        },
        dataType: 'json'
      });

    },
    fetch: function() {
      $.ajax({
        type: "GET",
        url: app.server,
        success: function(data) {
          _.forEach(data.results, function(message) {
            app.addMessage(message);
          });
        }
      });
    },
    clearMessages: function() {
      $('#chats').empty();
    },
    addMessage: function(message) {
      $('<div class="message" >' + _.escape(message.username) + ': ' + _.escape(message.text) + '</div>').appendTo('#chats');
      $('<div class="username" >' + _.escape(message.username) + '</div>').appendTo('#main');
    },
    addRoom: function(room) {
      $('<div class="' + room + '">' + room + '</div>').appendTo('#roomSelect');
    },
    addFriend: function() {

    },
    handleSubmit: function(val) {
      var username = window.location.search.slice(10);

      app.send({
        username: username,
        text: val,
        roomname: 'lobby'
      });

    }
  };

  app.fetch();


  $( document ).ready(function() {
    $( "#send" ).on("submit", function(event) {
      app.handleSubmit($('#message').val());
      event.preventDefault();

    });

    $( "#main").on("click", ".username", function() {
      console.log('bills right');
      app.addFriend();
    });
  });



