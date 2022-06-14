const {models} = require('../../src/models');

const { createExcelFile } = require("../createExcelFile");
const { turnCharactersIntoObjects } = require("../turnCharactersIntoObjects");
const { makeArrayofParagraphs } = require("../makeArrayofParagraphs");
const { searchCharacters } = require("../searchCharacters");
const { searchWords } = require("../searchWords");
const { highlight } = require("../highlight");

const {
  newCharWithDefinitionRelation,
  removeCharWithDefinitionRelation,
  newWordWithDefinitionRelation,
  removeWordWithDefinitionRelation,
} = require("../manageRelations");

const {
  findAllHighlightedWords,
  findAllWordsWithDefinitions,
  findAllCharsWithDefinitions,
} = require("../requeststoDB");

exports.clientinput = async (socket, data) => {
  try {
    const User = await models.User.findByLogin(data.userName);

    if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
      if (data && data.newInput && data.newInput.length > 0) {
        let charsWithDefinitions;
        let wordsWithDefinitions;
        let text;
        let highlightedText;

        let presentcount = 0;
        let processedInput;
        const totalcount = 20; // max 20

        const highlightedWords = await findAllHighlightedWords(User.id);

        const methodOfAnalysis = data.method;

        const allWordsWithDefinitions = await findAllWordsWithDefinitions(data.userName);
        for (let i=0; i<allWordsWithDefinitions.length; i++) {
          await removeWordWithDefinitionRelation(
            data.userName,
            allWordsWithDefinitions[i].traditional,
          );
        }

        const allCharsWithDefinitions = await findAllCharsWithDefinitions(data.userName);
        for (let i=0; i<allCharsWithDefinitions.length; i++) {
          await removeCharWithDefinitionRelation(
            data.userName,
            allCharsWithDefinitions[i].traditional,
          );
        }

        await models.Text.destroy({ where: { userId: User.id } });

        if (methodOfAnalysis === 'full') {
          // Text color + definitions
          const arrayofParagraphs = makeArrayofParagraphs(data.newInput);

          const objectifiedText = turnCharactersIntoObjects(arrayofParagraphs);
          presentcount = Math.round( totalcount*0.3 );
          socket.emit('ProgressBarAPI', presentcount);

          const wordsData = await searchWords(objectifiedText); // time consuming
          presentcount = Math.round( totalcount*0.8 );
          socket.emit('ProgressBarAPI', presentcount);

          const charsData = await searchCharacters(wordsData.data); // time consuming

          wordsWithDefinitions = wordsData.array//.sort((a,b) => b.count - a.count);
          charsWithDefinitions = charsData.array;

          createExcelFile(wordsWithDefinitions, data.userName)

          for (let i=0; i<wordsWithDefinitions.length; i++) {
            await newWordWithDefinitionRelation(
              data.userName,
              wordsWithDefinitions[i].traditional,
              JSON.stringify(wordsWithDefinitions[i]),
            );
          }

          for (let i=0; i<charsWithDefinitions.length; i++) {
            await newCharWithDefinitionRelation(
              data.userName,
              charsWithDefinitions[i].traditional,
              charsWithDefinitions[i].simplified,
              JSON.stringify(charsWithDefinitions[i]),
            );
          }

          text = charsData.data;

          highlightedText = highlight(text, highlightedWords, true);

          for (let i=0; i<highlightedText.length; i++) {
            await models.Text.create(
              {
                text: highlightedText[i],
                userId: User.id,
              },
            );
          }
        }

        // Stats
        processedInput = data.newInput.replace(/[^\u3400-\u9FBF]/g, '');
        const totalChars = processedInput.length;

        const charFrequency = [];

        while (processedInput.length > 0) {
          const charData = new RegExp(processedInput.charAt(0), 'g');
          const occurencesArray = processedInput.match(charData);

          charFrequency.push({
            character: occurencesArray[0],
            occurences: occurencesArray.length,
          })

          processedInput = processedInput.replace(charData, '');
        }

        charFrequency.sort(function(a, b) {
          return b.occurences - a.occurences;
        });

        await models.CharFrequency.destroy({ where: { userId: User.id } });
        for (let i=0; i<charFrequency.length; i++) {
          await models.CharFrequency.create(
            {
              character: charFrequency[i].character,
              occurences: charFrequency[i].occurences,
              userId: User.id,
            },
          );
        }

        await models.User.update(
          {
            trunkateAt: 0,
            totalChars: totalChars,
          },
          {where: {userName: data.userName}},
        );

        socket.emit('ProgressBarAPI', 21);

        const API = {
          text: highlightedText,
          trunkateAt: 0,
          charsWithDefinitions: charsWithDefinitions,
          wordsWithDefinitions: wordsWithDefinitions,
          totalChars: totalChars,
          charFrequency: charFrequency,
        };
        socket.emit('processedInputAPI', API);
        socket.emit('unlockFeatureAPI', 'RecoveryButton');
      }
    }
  }
  catch(e) {
    console.log(e)
  }
}
