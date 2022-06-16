function compareTones(array, firstTone) {
  let count;

  for (let i=0; i<array.length; i++) {
    if (firstTone === parseInt(array[i].replace(/\D/g,'')[0])) {
      count = true;
    }
    else {
      count = false;
      break;
    }
  }

  return count;
}

exports.searchCharacters = async (data, socket) => {
  const { getCharacterData } = require("./getCharacterData");
  const { toneExceptions } = require("./toneExceptions");

  const array = [];
  const characterMemory = [];

  for (let i=0; i<data.length; i++) {
    //console.log(`Analysing single characters' data (${i+1}/${data.length})`)
    socket.emit('ProgressBarTextAPI', `Analysing single characters' data (${i+1}/${data.length})`);
    for (let j=0; j<data[i].length; j++) {
      if (data[i][j].isChinese && data[i][j].tone === 0) {
        try {
          const dictionaryEntries = await getCharacterData(data[i][j].character);

          const definitionsKeysArray = Object.keys(dictionaryEntries.definitions);
          const firstTone = parseInt(definitionsKeysArray[0].replace(/\D/g,'')[0]);

          // if all the tones of all the possible pronunciations are the same OR there is only one
          // pronunciation, THEN set the text tone color
          if (compareTones(definitionsKeysArray, firstTone) || definitionsKeysArray.length === 1) {
            data[i][j].tone = firstTone;
          }

          const correctedTone = toneExceptions(data[i][j].character);
          if (correctedTone) {
            data[i][j].tone = correctedTone;
          }

          if (!data[i][j].word) {
            data[i][j].word = data[i][j].character;
          }
          data[i][j].words.push(data[i][j].character);

          if (characterMemory.indexOf(data[i][j].character) === -1) {
            characterMemory.push(data[i][j].character);

            array.push(dictionaryEntries);
          }
        }
        catch(e) {}
      }
    }
  }

  return {
    data: data,
    array: array,
  };
}
