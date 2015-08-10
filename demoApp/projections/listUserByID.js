function eventHandler(state, event) {

  var user = event.payload.user;

  if (!(user.id in state)) {
    state[user.id] = {};
  }

  state[user.id].id = user.id;
  state[user.id].fullname = user.first + ' ' + user.last;

  if(user.last.length > 8) {
    state[user.id].username = (user.last.substring(0,7) + user.first.charAt(0)).toLowerCase();
  }

  state[user.id].username = (user.last + user.first.charAt(0)).toLowerCase();
  state[user.id].first = user.first;
  state[user.id].last = user.last;
  state[user.id].password = user.password;

  return state;

}
