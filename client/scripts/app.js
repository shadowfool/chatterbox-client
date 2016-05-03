
//change user name
//Optional, better handle loading new entries instead of wipe/clear

  var app = {
    server: 'https://api.parse.com/1/classes/messages',
    currentRoom: '',
    friends: [],
    rooms: [],
    init: function(name) {
    },
    send: function(message) {
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        success: function() {
        },
        error: function(errMessage) {
        },
        dataType: 'json'
      });
    },
    fetch: function() {
      $.ajax({
        type: 'GET',
        url: app.server,
        success: function(data) {
          app.clearMessages();
          _.forEach(data.results, function(message) {
            var room = app.sanitize(message.roomname).trim();
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
    addMessage: function(message) {
      var userName = app.sanitize(message.username);
      var clazz = '';
      if (app.friends.indexOf(userName) >= 0) {
        clazz = ' friend';
      }
      $('<div class="chat" ><a href="" class="chat username' + clazz + '">' + userName + '</a> ' + app.sanitize(message.text) + '</div>').appendTo('#chats');
    },
    addRoom: function(room) {
      $('<option value="' + room + '">' + room + '</option>').appendTo('#roomSelectData');
    },
    addRemoveFriend: function(val) {
      var friend = app.sanitize(val);
      var friendIndex = _.indexOf(app.friends, friend);
      if (friendIndex === -1) {
        app.friends.push(friend);
      } else {
        app.friends.splice(friendIndex, 1);
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
    },
    sanitize: function(data) {
      return _.escape(data);
    }
  };


  $( document ).ready(function() {
    setInterval(app.fetch, 1000);
    //Send Message
    $( '#send' ).on('submit', function(event) {
      app.handleSubmit($('#message').val());
      event.preventDefault();
      $('#message').val('');
    });

    //Friend/Defriend
    $( '#chats').on('click', '.username', function(event) {
      event.preventDefault();
      app.addRemoveFriend($(this).text());
    });

    //Room Select
    $( '#roomSelect').on('input', function(event) {
      currentRoom = $(this).val();
      app.filterRooms($(this).val());
    });

  });


