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
    currentRoom : '',
    friends: [],
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
            if (_.indexOf(app.rooms, room) === -1 && room !== '') {
              app.rooms.push(room);
              app.addRoom(room);
            }

            if (room === app.currentRoom) {
              app.addMessage(message);
            }
             
          });
        }
      });
    },
    clearMessages: function() {
      $('#chats').empty();
    },
    rooms: ['lobby'],
    addMessage: function(message) {
      var userName = _.escape(message.username);
      var clazz = '';
      if (app.friends.indexOf(userName) >= 0) {
        clazz = "friend";
      }
      $('<div class="message" ><a href="" class="username ' + clazz + '">' + userName  + '</a> ' + _.escape(message.text) + '</div>').appendTo('#chats');
      
      // $('<div class="username" >' + _.escape(message.username) + '</div>').appendTo('#main');
    },
    addRoom: function(room) {
      $('<option value="' + room + '">' + room + '</option>').appendTo('#roomSelectData');
    },
    addRemoveFriend: function(val) {
      var friend = _.escape(val);
      var friendIndex = _.indexOf(app.friends, friend);
      if (friendIndex === -1) {
        app.friends.push(friend);
      } else {
        app.friends.splice(friendIndex,1);
        //remove friend
      }
    },
    handleSubmit: function(val) {
      var username = window.location.search.slice(10);
      app.send({
        username: username,
        text: val,
        roomname: currentRoom
      });
    },
    filterRooms: function(room) {
      app.currentRoom = room;
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
      app.addRemoveFriend($(this).text());
    });

    $( "#roomSelect").on("input", function(event) {
      currentRoom = $(this).val();
      app.filterRooms($(this).val());
    });


  });
  setInterval(app.fetch, 1000);


