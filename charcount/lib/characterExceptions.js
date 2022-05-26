exports.characterExceptions = (character) => {
  /*
  EXCEPTIONS: these are a few characters that the MDBG database seems to always get
  wrong for a reason I don't understand, so here's the only solution I found: harcoded exceptions
  */
  const newObject = {};

  switch(character) {
    case '是':
      newObject.traditional = '是';
      newObject.simplified = '是';
      newObject.usedpinyin = 'shi4';
      newObject.translations = ['is', 'are', 'am', 'yes', 'to be'];
      return newObject;
    case '吃':
      newObject.traditional = '吃';
      newObject.simplified = '吃';
      newObject.usedpinyin = 'chi1';
      newObject.translations = ["to eat","to consume","to eat at (a cafeteria etc)","to eradicate","to destroy","to absorb","to suffer"];
      return newObject;
    case '出':
      newObject.traditional = '出';
      newObject.simplified = '出';
      newObject.usedpinyin = 'chu1';
      newObject.translations = ["to go out","to come out","to occur","to produce","to go beyond","to rise","to put forth","to happen","(used after a verb to indicate an outward direction or a positive result)","classifier for dramas, plays, operas etc","variant of 出[chu1] (classifier for plays or chapters of classical novels)"];
      return newObject;
    default:
      return null;
  }
}
