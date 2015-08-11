function eventHandler(state, event) {

  var user = event.payload.user;

  if (!(user.id in state)) {
    state[user.id] = {};
  }

  state[user.id].id = user.id;
  state[user.id].fullname = user.first + ' ' + user.last;

  var username = null;

  if(user.last.length > 8) {
    username = (user.last.substring(0,7) + user.first.charAt(0)).toLowerCase();
  }
  else {
    username = (user.last + user.first.charAt(0)).toLowerCase();
  }

  state[user.id].username = username.replace(/ /g,'');
  state[user.id].first = user.first;
  state[user.id].last = user.last;
  state[user.id].password = user.password;

  return state;

}
