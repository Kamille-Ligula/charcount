exports.highlight = (text, highlightedWords, mustHighlight) => {
  let highlight = false;
  for (let i=0; i<text.length; i++) {
    for (let j=0; j<text[i].length; j++) {
      for (let l=0; l<highlightedWords.length; l++) {
        for (let k=0; k<highlightedWords[l].length; k++) {
          if (text[i][j+k] && text[i][j+k].character === highlightedWords[l][k]) {
            highlight = true;
          }
          else {
            highlight = false;
            break;
          }
        }
        if (highlight) {
          for (let k=0; k<highlightedWords[l].length; k++) {
            text[i][j+k].isHighlighted = mustHighlight;
          }
          highlight = false;
        }
      }
    }
  }

  return text;
}
