function eventHandler(state, event) {

  var user = event.payload.user;

  if (!(user.last in state)) {
    state[user.last] = {};
  }

  state[user.last].id = user.id;
  state[user.last].fullname = user.first + ' ' + user.last;

  if(user.last.length > 8) {
    state[user.last].username = (user.last.substring + user.first.charAt(0)).toLowerCase();
  }

  state[user.last].username = (user.last + user.first.charAt(0)).toLowerCase();
  state[user.last].first = user.first;
  state[user.last].last = user.last;
  state[user.last].password = user.password;
  
  return state;

}
