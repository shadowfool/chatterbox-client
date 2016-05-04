
//change user name
//Optional, better handle loading new entries instead of wipe/clear

  var app = {
    server: 'https://api.parse.com/1/classes/messages',
    currentRoom: '',
    friends: [],
    rooms: [],
    chatLog: {},
    username: window.location.search.slice(10),
    tabs: {},
    copyCopy: false,
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
      var query = {'order': '-createdAt', 'where': {'roomname': app.currentRoom}};
      $.ajax({
        type: 'GET',
        url: app.server,
        data: query,
        success: function(data) {
          //reversed to show up in reverse chron order
          _.forEach(data.results.reverse(), function(obj) {
            if (app.chatLog[obj.objectId] === undefined) {
              app.chatLog[obj.objectId] = obj;
              // if (obj.username !== app.username && app.copycopy) {
              //   var copy = {};
              //   copy.text = app.pigLatin(obj.text);
              //   copy.roomname = obj.roomname;
              //   copy.username = app.username;
              //   app.stopCopyingMe(copy);
              // }
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
    copyFetch: function() {
      var query = {'order': '-createdAt'};
      $.ajax({
        type: 'GET',
        url: app.server,
        data: query,
        success: function(data) {
          //reversed to show up in reverse chron order
          _.forEach(data.results.reverse(), function(obj) {
            if (app.chatLog[obj.objectId] === undefined) {
              app.chatLog[obj.objectId] = obj;
              if (obj.username !== app.username && app.copycopy) {
                var copy = {};
                copy.text = app.pigLatin(obj.text);
                copy.roomname = obj.roomname;
                copy.username = app.username;
                console.log('copying ' + obj.username + ' at ' + copy.roomname + ' with message: ' + copy.text);

                app.stopCopyingMe(copy);
              }
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
      if (userName.trim() === '' && message.trim() === '') {
        return;
      }
      var newChat = $('<div class="chat" >' + message + '</div>');
      var userSpan = $('<div class="spacer" ></div>');
      var newUser = $('<span class="username">' + userName + '</span>');
      userSpan.prepend(newUser);
      newChat.prepend(userSpan);
      newChat.prependTo('#chats');
      
      if (app.friends.indexOf(userName) >= 0) {
        $(newUser).addClass('friend');
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
    },
    addTab: function(room) {
      if (app.tabs[room] === undefined) {
        app.tabs[room] = room;
        var newTab = $('<div class="tab" >' + room + '</div>');
        newTab.appendTo('#tabs');
      }
    },
    stopCopyingMe: function(message) {
      app.send(message);
    },
    pigLatin : function(word) {
      var array = word.split('');
      var vowels = ['a','e','i','o','u'];
      var newWord = '';
      for (var i = 0; i < vowels.length - 1; i++) {
        for (var y = 0; y < word.length - 1; y++) {
          if (word[y] === vowels[i]) {
            for (var x = y; x < word.length; x++) {
              newWord = newWord + word[x];
            }
            for (var n = 0; n < y; n++) { 
              newWord = newWord + word[n];
            }
            return newWord + "ay";
          }       
        }
      }
    }
  };


  $( document ).ready(function() {
    setInterval(app.fetch, 1000);
    setInterval(app.fetchRoomList, 10000);
    setInterval(app.copyFetch, 1000);
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
      app.filterRooms(currentVal);
    });
    //Change user name
    $( '#name').on('click', function(event) {
      var newSearch = 'username=' + (prompt('What is your name?') || 'anonymous');
      window.location.search = newSearch;
    });
    //Add current room as new tab
    $( '#tabify' ).on('click', function(event) {
      app.addTab(app.currentRoom);
      event.preventDefault();
    });

    $('#tabs').on('click', '.tab', function(event) {
      //debugger;
      app.currentRoom = $(this).text();
      app.filterRooms(app.currentRoom);
      event.preventDefault();
    });
    $('#main').on('click', '#copycopy', function(event) {
      $('#copycopy').toggleClass('red');
      app.copycopy = !app.copycopy;
    });
  });


//

