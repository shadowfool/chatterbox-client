// YOUR CODE HERE:

///hacking ideas:
// put stuff in the user name
//request username hack


//TODO
//bold friends
//create rooms
//change name

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
          app.clearMessages();
          _.forEach(data.results, function(message) {
            var room = _.escape(message.roomname).trim();
            if (_.indexOf(app.rooms, room) === -1 && room !== ''){
              app.rooms.push(room);
              app.addRoom(room);
            }
            app.addMessage(message);
          });
        }
      });
    },
    clearMessages: function() {
      $('#chats').empty();
    },
    rooms: ['lobby'],
    addMessage: function(message) {
      $('<div class="message" ><a href="" class="username">' + _.escape(message.username) + '</a> ' + _.escape(message.text) + '</div>').appendTo('#chats');
      // $('<div class="username" >' + _.escape(message.username) + '</div>').appendTo('#main');
    },
    addRoom: function(room) {
      $('<option value="' + room + '">' + room + '</option>').appendTo('#roomSelect');
    },
    addFriend: function(val) {
      var friend = _.escape(val);
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
      $('#message').val('');

    });

    $( "#main").on("click", ".username", function(event) {
      event.preventDefault();
      app.addFriend($(this).text());
    });
  });
  setInterval(app.fetch, 1000);


