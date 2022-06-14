const {models} = require('../../src/models');

const { createExcelFile } = require("../createExcelFile");

const {
  findAllCharacterFrequencies,
  findAllTexts,
  findAllWordsWithDefinitions,
  findAllCharsWithDefinitions,
} = require("../requeststoDB");

exports.resubmit = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      const totalChars = User.totalChars;

      const frequencies = await findAllCharacterFrequencies(User.id);
      const allTexts = await findAllTexts(User.id);
      const allWordsWithDefinitions = await findAllWordsWithDefinitions(data.userName);
      const allCharsWithDefinitions = await findAllCharsWithDefinitions(data.userName);

      createExcelFile(allWordsWithDefinitions, data.userName)

      socket.emit('ProgressBarAPI', 21);

      const trunkateAt = User.trunkateAt;

      const API = {
        text: allTexts,
        trunkateAt: trunkateAt,
        charsWithDefinitions: allCharsWithDefinitions,
        wordsWithDefinitions: allWordsWithDefinitions,
        totalChars: totalChars,
        charFrequency: frequencies,
      };
      socket.emit('processedInputAPI', API);
    }
  }
  catch(e) {
    console.log(e)
  }
}
