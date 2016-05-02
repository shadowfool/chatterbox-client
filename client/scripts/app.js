// YOUR CODE HERE:

///hacking ideas:
// put stuff in the user name
//request username hack

  var app = {
    server:"https://api.parse.com/1/classes/messages",
    init: function() {
      console.log('init called' + Array.prototype.slice.call(arguments));

    },
    send: function(message) {
      // $.post( "https://api.parse.com/1/classes/messages", function( data ) {
      //   console.log("posted");
      // });


      $.ajax({
        type: "POST",
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
      console.log('v' + val);
      return;
    }
  };

  app.fetch();


  $( document ).ready(function() {
    $( "#send" ).on("click", ".submit", function(event) {
      app.handleSubmit($('#message').val());
      event.preventDefault();

    });
    $( "#send").on("click", function(event) {
      app.handleSubmit($('#message').val());
      event.preventDefault();

    });



    $( "#main").on("click", ".username", function() {
      console.log('bills right');
      app.addFriend();
    });
  });



