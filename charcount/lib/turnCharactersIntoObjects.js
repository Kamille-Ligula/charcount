exports.turnCharactersIntoObjects = (data) => {
  const array = [[]];
  for (let i=0; i<data.length; i++) {
    if (array[array.length-1].length !== 0) {
      array.push([]);
    }
    for (let j=0; j<data[i].length; j++) {
      array[array.length-1][j] = {
        character: data[i][j],
        tone: 0,
        words: [],
        isChinese: data[i][j].match(/[\u3400-\u9FBF]/) ? true : false,
        isUnderlined: false,
      };
    }
  }
  return array;
}
