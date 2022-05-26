exports.toneExceptions = (character) => {
  /*
  EXCEPTIONS: these are a few characters that have more than one tone,
  but sometimes only one is really used and the others are either rare,
  or belong to cases that have been taken into account precedently by the algorithm
  (which is the case for a few specific words such as 可汗, which is the only existing
  exception to 可 being a 3rd tone, so, taking into account that the algorithm would have
  already classified it as being part of this word if it were the case, any 可 left here
  will undoubtedly be 3rd tone 可's).
  So here's again a few harcoded exceptions, each with varying degrees of legitimity
  (meaning not all are as certain as 可).
  */
  switch(character) {
    case '說':
      return 1;
    case '说':
      return 1;
    case '過':
      return 4;
    case '过':
      return 4;
    case '那':
      return 4;
    case '上':
      return 4;
    case '了':
      return 5;
    case '嘍':
      return 5;
    case '喽':
      return 5;
    case '咧':
      return 5;
    case '的':
      return 5;
    case '正':
      return 4;
    case '著':
      return 5;
    case '着':
      return 5;
    case '要':
      return 4;
    case '把':
      return 3;
    case '邊':
      return 1;
    case '可':
      return 3;
    case '幾':
      return 3;
    case '好':
      return 3;
    case '打':
      return 3;
    default:
      return null;
  }
}
