// YOUR CODE HERE:



  $( document ).ready(function() {
    $( "#submitText" ).click(function() {
      alert( 'Handler for .click() called.' );
    });
  });

/*
  var result = _.escape('string');
  console.log(result); 

        url: "https://api.parse.com/1/classes/messages",
*/
///hacking ideas:
// put stuff in the user name
//request username hack

  var app = {
    server:"https://api.parse.com/1/classes/messages",
    init: function() {
      return true;
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
            addMessage(message);
          });
        }
      });
    },
    clearMessages() {
      $('#chats').empty();
    },
    addMessage(message) {
      $('<div class="message">' + _.escape(message.username) + ': ' + _.escape(message.text) + '</div>').appendTo('#chats');
    },
    addRoom(room) {
      $('<div class="' + room + '">' + room + '</div>').appendTo('#roomSelect');
    }
  };

  app.fetch();
