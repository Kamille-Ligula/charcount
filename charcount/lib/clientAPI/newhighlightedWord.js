const {models} = require('../../src/models');
const { highlight } = require("../highlight");

const {
  findAllHighlightedWords,
  findAllTexts,
} = require("../requeststoDB");

exports.newhighlightedWord = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      const highlightedWords = await findAllHighlightedWords(User.id);
      const allTexts = await findAllTexts(User.id);
      let highlightedText;

      if (highlightedWords.indexOf(data.newhighlightedWord) === -1) {
        // add word
        highlightedWords.push(data.newhighlightedWord)

        highlightedText = highlight(allTexts, [data.newhighlightedWord], true);
      }
      else {
        // remove word
        highlightedWords.splice(highlightedWords.indexOf(data.newhighlightedWord), 1);

        highlightedText = highlight(allTexts, [data.newhighlightedWord], false);
      }

      await models.HighlightedWord.create(
        {
          highlighted: data.newhighlightedWord,
          userId: User.id,
        },
      );

      await models.Text.destroy({ where: { userId: User.id } });

      for (let i=0; i<highlightedText.length; i++) {
        await models.Text.create(
          {
            text: highlightedText[i],
            userId: User.id,
          },
        );
      }

      const trunkateAt = User.trunkateAt;

      const API = {
        text: highlightedText,
        trunkateAt: trunkateAt,
      };
      socket.emit('highlightAPI', API);
    }
  }
  catch(e) {
    console.log(e)
  }
}
