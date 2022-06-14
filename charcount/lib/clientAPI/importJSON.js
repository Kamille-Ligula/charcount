const {models} = require('../../src/models');
const { removeDuplicates } = require("../removeDuplicates");

const {
  newKnownCharRelation,
  removeKnownCharRelation
} = require("../manageRelations");

const {
  findAllKnownCharacters
} = require("../requeststoDB");

exports.importJSON = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid && data.import) { // authentication
      const allKnownChars = await findAllKnownCharacters(data.userName);
      for (let i=0; i<allKnownChars.length; i++) {
        await removeKnownCharRelation(data.userName, allKnownChars[i]);
      }

      const knownCharsList = removeDuplicates(JSON.parse(data.import.toString()));
      for (let i=0; i<knownCharsList.length; i++) {
        await newKnownCharRelation(data.userName, knownCharsList[i]);
      }

      socket.emit('KnownCharactersAPI', knownCharsList);
    }
  }
  catch(e) {
    console.log(e)
  }
}
