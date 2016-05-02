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
  var app = {
    init: function() {
      return true;
    },
    send: function(message) {
      // $.post( "https://api.parse.com/1/classes/messages", function( data ) {
      //   console.log("posted");
      // });


      $.ajax({
        type: "POST",
        url: "https://api.parse.com/1/classes/messages",
        data: JSON.stringify(message),
        success: function() {
        },
        dataType: 'json'
      });

    },
    fetch: function() {
      $.ajax({
        type: "GET",
        success: function() {
        }
      });
    },
    clearMessages() {
      $('#chats').html('');
    }
  
  };
