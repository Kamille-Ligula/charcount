const {models} = require('../../src/models');

const {
  removeKnownCharRelation
} = require("../manageRelations");

exports.clientSendUnknownChar = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      await removeKnownCharRelation(data.userName, data.newUnknownCharacter);
    }
  }
  catch(e) {
    console.log(e)
  }
}
