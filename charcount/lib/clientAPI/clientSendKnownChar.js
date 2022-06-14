const {models} = require('../../src/models');

const {
  newKnownCharRelation
} = require("../manageRelations");

exports.clientSendKnownChar = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      await newKnownCharRelation(data.userName, data.newKnownCharacter);
    }
  }
  catch(e) {
    console.log(e)
  }
}
