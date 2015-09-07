function eventHandler(state, event) {

  var user = event.payload.user;
  var username = null;

  if(user.last.length > 8) {
    username = (user.last.substring(0,7) + user.first.charAt(0)).toLowerCase();
  }
  else {
    username = (user.last + user.first.charAt(0)).toLowerCase();
  }

  username = username.replace(/ /g,'');


  if (!(username in state)) {
    state[username] = {};
  }

  state[username].id = user.id;
  state[username].fullname = user.first + ' ' + user.last;
  state[username].username = username;
  state[username].first = user.first;
  state[username].last = user.last;
  state[username].password = user.password;
  state[username].active = user.active;

  return state;
}
