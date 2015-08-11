function eventHandler(state, event) {

  var user = event.payload.user;

  if (!(user.last in state)) {
    state[user.last] = {};
  }

  state[user.last].id = user.id;
  state[user.last].fullname = user.first + ' ' + user.last;

  var username = null;

  if(user.last.length > 8) {
    username = (user.last.substring(0,7) + user.first.charAt(0)).toLowerCase();
  }
  else {
    username = (user.last + user.first.charAt(0)).toLowerCase();
  }

  state[user.last].username = username.replace(/ /g,'');
  state[user.last].first = user.first;
  state[user.last].last = user.last;
  state[user.last].password = user.password;

  return state;
}
