exports.searchWords = async (data) => {
  const array = [];
  const wordMemory = [];

  for (let i=0; i<data.length; i++) {
    for (let j=0; j<data[i].length; j++) {
      let combination;

      function repeatedAssigments(assignWhere) {

        for (let k=0; k<assignWhere.length; k++) {
          if (data[i][j+k]) { // avoid crash if text starts with comma
            if (combination[assignWhere[k]]) {
              data[i][j+k] = combination[assignWhere[k]];
              if (data[i][j+k].words.indexOf(combination[assignWhere[k]].word) === -1) {
                data[i][j+k].words.push(combination[assignWhere[k]].word)
              }
            }
          }
        }

        if (combination.word && wordMemory.indexOf(combination.word) === -1) {
          wordMemory.push(combination.word);
          array.push(combination.dictionaryEntries);
        }
      }

      combination = await tryCharacterCombination(data[i][j], data[i][j+1], data[i][j+2], data[i][j+3], data[i][j+4]);
      repeatedAssigments(['aa', 'bb', 'cc', 'dd', 'ee']);

      combination = await tryCharacterCombination(data[i][j], data[i][j+1], data[i][j+2], data[i][j+3]);
      repeatedAssigments(['aa', 'bb', 'cc', 'dd']);

      combination = await tryCharacterCombination(data[i][j], data[i][j+1], data[i][j+2]);
      repeatedAssigments(['aa', 'bb', 'cc']);

      combination = await tryCharacterCombination(data[i][j], data[i][j+1]);
      repeatedAssigments(['aa', 'bb']);
    }
  }

  return {
    data: data,
    array: array,
  };
}

async function tryCharacterCombination(aa, bb, cc, dd, ee) {
  const { getCharacterData } = require("./getCharacterData");

  if (!ee) { ee = {character: '', isChinese: true, tone: 0} }
  if (!dd) { dd = {character: '', isChinese: true, tone: 0} }
  if (!cc) { cc = {character: '', isChinese: true, tone: 0} }

  if (
    (bb && cc && dd && ee) &&
    (aa.isChinese && bb.isChinese && cc.isChinese && dd.isChinese && ee.isChinese)
  ) {
    try {
      const word = aa.character + bb.character + cc.character + dd.character + ee.character;

      const dictionaryEntries = await getCharacterData(word);

      const tones = Object.keys(dictionaryEntries.definitions)[0].replace(/\D/g,'');
      if (aa.tone === 0 && bb.tone === 0 && cc.tone === 0 && dd.tone === 0 && ee.tone === 0) {
        aa.tone = parseInt(tones[0]);
        bb.tone = parseInt(tones[1]);
        cc.tone = parseInt(tones[2]);
        dd.tone = parseInt(tones[3]);
        ee.tone = parseInt(tones[4]);
      }

      aa.word = word;
      bb.word = word;
      cc.word = word;
      dd.word = word;
      ee.word = word;

      // if no hsk, add blank hsk string
      if (!dictionaryEntries.hsk) { dictionaryEntries.hsk = '' }
      else { dictionaryEntries.hsk = dictionaryEntries.hsk.toString() }

      return {
        aa: aa,
        bb: bb,
        cc: cc,
        dd: dd,
        ee: ee,
        word: word,
        dictionaryEntries: dictionaryEntries,
      };
    }
    catch(e) {}
  }

  return {
    aa: null,
    bb: null,
    cc: null,
    dd: null,
    ee: null,
    word: null,
    dictionaryEntries: null,
    //add: 0,
  };
}
