const {models} = require('../../src/models');

exports.trunkateAt = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      let trunkateAt = User.trunkateAt;

      if (User.socketid === socket.id /* verify socket id to avoid duplicating signal */) {
        trunkateAt += data.key;
      }

      await models.User.update(
        {
          trunkateAt: trunkateAt,
        },
        {where: {userName: data.userName}},
      );
    }
  }
  catch(e) {
    console.log(e)
  }
}
