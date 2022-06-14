const {models} = require('../../src/models');
const { getCharacterData } = require("../getCharacterData");
//const { characterExceptions } = require("../characterExceptions");

exports.searchWordInText = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      const dictionaryEntries = [];

      if (data.searchWord && data.searchWord.isChinese) {
        for (let i=0; i<data.searchWord.words.length; i++) {
          const CharTradi = await models.CharWithDefinition.findByCharTradiName(data.searchWord.words[i]);
          if (CharTradi) {
            dictionaryEntries.push(JSON.parse(CharTradi.dataValues.data));
          }
          else {
            const CharSimpl = await models.CharWithDefinition.findByCharSimplName(data.searchWord.words[i]);
             if (CharSimpl) {
              dictionaryEntries.push(JSON.parse(CharSimpl.dataValues.data));
            }
            else {
              dictionaryEntries[i] = await getCharacterData(data.searchWord.words[i]);
            }
          }

          // if too many words in the database need updating (still it would be better to update them in the DB):
          /*const correctedEntries = characterExceptions(data.searchWord.words[i]);
          if (correctedEntries) {
            dictionaryEntries[i].traditional = correctedEntries.traditional;
            dictionaryEntries[i].simplified = correctedEntries.simplified;
            dictionaryEntries[i].definitions[correctedEntries.usedpinyin].translations = correctedEntries.translations;
          }*/
        }
      }

      socket.emit('wordDataAPI', dictionaryEntries);
    }
  }
  catch(e) {
    console.log(e)
  }
}
