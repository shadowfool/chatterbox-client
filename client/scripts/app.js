
//change user name
//Optional, better handle loading new entries instead of wipe/clear

  var app = {
    server: 'https://api.parse.com/1/classes/messages',
    currentRoom: ' ',
    friends: [],
    rooms: [],
    chatLog: {},
    username: window.location.search.slice(10),
    init: function(name) {
      $('#name').text(app.username);
    },
    send: function(message) {
      // $('.spinner').css('visibility', 'visible');
      $('.spinner').show();
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        success: function() {
          setTimeout( function() {
            $('.spinner').hide();
          }, 500);
        },
        error: function(errMessage) {
        },
        dataType: 'json'
      });
    },
    fetch: function() {
      var query = {'where': {'roomname': app.currentRoom}};
      $.ajax({
        type: 'GET',
        url: app.server,
        data: query,
        success: function(data) {
          //console.log(data);
          //reversed to show up in reverse chron order
          _.forEach(data.results, function(obj) {
            //console.log(obj, app.chatLog[obj.objectId]);
            if (app.chatLog[obj.objectId] === undefined) {
              app.chatLog[obj.objectId] = obj;

              var room = app.sanitize(obj.roomname);
              if (_.indexOf(app.rooms, room) === -1) {
                app.rooms.push(room);
                app.addRoom(room);
              }
              app.addMessage(obj);
            }
          });
        }
      });
    },
    fetchRoomList: function() {
      $.ajax({
        type: 'GET',
        url: app.server,
        success: function(data) {
          _.forEach(data.results, function(obj) {
            var room = app.sanitize(obj.roomname);
            if (_.indexOf(app.rooms, room) === -1 && room !== '') {
              app.rooms.push(room);
              app.addRoom(room);
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
      var message = app.sanitize(message.text);
      var newNode = $('<div class="chat" ><div class="spacer"><span class="username">' + userName + ':</span></div>' + message + '</div>').prependTo('#chats');
      if (app.friends.indexOf(userName) >= 0) {
        //$(newNode).addClass('friend');
      }
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
      }
      var res = $('.username');
      for (var i = 0; i < res.length; i++) {
        var updateMe = res[i];
        if ($(updateMe).text() === val) {
          $(updateMe).toggleClass('friend');
        }
      }
    },
    handleSubmit: function(val) {
      app.send({
        username: app.username,
        text: val,
        roomname: app.currentRoom
      });
    },
    filterRooms: function(room) {
      app.currentRoom = room;
      //clear messages with wrong room
      app.clearMessages();
      // display messages with the same room as current room
      _.forEach(app.chatLog, function(chat) {
        if (chat.roomname === app.currentRoom) {
          app.addMessage(chat);
        }
      });
    },
    sanitize: function(data) {
      return _.escape(data);
    }
  };


  $( document ).ready(function() {
    setInterval(app.fetch, 1000);
    setInterval(app.fetchRoomList, 10000);
    app.init();
    app.fetchRoomList();
    //Send Message
    $( '#send' ).on('submit', function(event) {
      app.handleSubmit($('#message').val());
      event.preventDefault();
      $('#message').val('');
    });

    //Friend/Defriend
    $('#chats').on('click', '.username', function(event) {
      event.preventDefault();
      app.addRemoveFriend($(this).text());
    });

    //Room Select
    $( '#roomSelect').on('input', function(event) {
      var currentVal = $(this).val();
      if ($(this).val() === '') {
        currentVal = ' ';
      }
      app.filterRooms(currentVal);
    });
    //Room Select
    $( '#name').on('click', function(event) {
      var newSearch = 'username=' + (prompt('What is your name?') || 'anonymous');
      window.location.search = newSearch;
    });
  });


//

