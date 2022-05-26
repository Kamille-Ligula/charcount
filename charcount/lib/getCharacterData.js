const MDBG = require('mdbg');

const { characterExceptions } = require("./characterExceptions");

exports.getCharacterData = async (character) => {
  const response = await MDBG.get(character);

  if (character === '下面') {
    response.definitions['xia4 mian4'].translations = ['below', 'under', 'next', 'the following', '下麵 (下面): to boil noodles'];
    response.simplified = '下面';
    response.traditional = '下面';
  }

  const correctedEntries = characterExceptions(character);
  if (correctedEntries) {
    response.traditional = correctedEntries.traditional;
    response.simplified = correctedEntries.simplified;
    response.definitions[correctedEntries.usedpinyin].translations = correctedEntries.translations;
  }

  return response;
}
