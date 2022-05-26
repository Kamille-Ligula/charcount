// email verification

exports = module.exports = async function(io, app, path) {
  const fs = require('fs');
  const { turnCharactersIntoObjects } = require("./lib/turnCharactersIntoObjects");
  const { makeArrayofParagraphs } = require("./lib/makeArrayofParagraphs");
  const { searchCharacters } = require("./lib/searchCharacters");
  const { getCharacterData } = require("./lib/getCharacterData");
  const { searchWords } = require("./lib/searchWords");
  const { removeDuplicates } = require("./lib/removeDuplicates");
  const { highlight } = require("./lib/highlight");
  const { createExcelFile } = require("./lib/createExcelFile");
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const { characterExceptions } = require("./lib/characterExceptions");
  const {
    newKnownCharRelation,
    removeKnownCharRelation,
    newCharWithDefinitionRelation,
    removeCharWithDefinitionRelation,
    newWordWithDefinitionRelation,
    removeWordWithDefinitionRelation,
  } = require("./lib/manageRelations");
  const {
    findAllKnownCharacters,
    findAllHighlightedWords,
    findAllCharacterFrequencies,
    findAllTexts,
    findAllWordsWithDefinitions,
    findAllCharsWithDefinitions,
    findAllKnownChars,
  } = require("./lib/requeststoDB");

  const {models, sequelize} = require('./src/models');

  const eraseDatabaseOnSync = false;
  sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => { if (eraseDatabaseOnSync) {/* do stuff */} });

  io.use(async (socket, next) => {
    try {
      const data = JSON.parse(socket.handshake.auth.token);

      let user = await models.User.findByLogin(data.userName);

      if (!user && data.email && data.password) { // register
        await models.User.create(
          {
            userName: data.userName,
            email: data.email,
            password: data.password,
          },
        );
        user = await models.User.findByLogin(data.userName);
      }

      if (user) { // login
        if (data.password) {
          const matchPasswords = await bcrypt.compare(data.password, user.password);

          if (matchPasswords) {
            socket.connectionToken = data.connectionToken;

            await models.User.update(
              {
                socketid: socket.id,
                connectionToken: data.connectionToken,
              },
              {where: {userName: data.userName}},
            );
          }
        }
        else {
          if (data.connectionToken === user.connectionToken) {
            socket.connectionToken = data.connectionToken;

            await models.User.update(
              {
                socketid: socket.id,
                connectionToken: data.connectionToken,
              },
              {where: {userName: data.userName}},
            );
          }
        }

        user = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === user.connectionToken && socket.id === user.socketid) { // authentication
          const knownChars = await findAllKnownCharacters(data.userName) || [];
          const textExists = await models.Text.findOne({ where: { userId: user.id }, });

          socket.emit('KnownCharactersAPI', knownChars);
          socket.emit('userLoggedInAPI', data.userName);
          if (textExists) {
            socket.emit('unlockFeatureAPI', 'RecoveryButton');
          }
        }
        else {
          socket.emit('failedConnectionAPI', 'Wrong identifiers');
        }
      }
      else {
        console.log('')
        console.log("user doesn't exist and can't be created")
        console.log('')
      }
      next();
    }
    catch(e) {
      console.log(e)
      next();
    }
  })

  io.on("connection", async (socket) => {
    socket.on('clientSendKnownChar', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          await newKnownCharRelation(data.userName, data.newKnownCharacter);
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('clientSendUnknownChar', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          await removeKnownCharRelation(data.userName, data.newUnknownCharacter);
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('searchWordInText', async (data) => {
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
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('trunkateAt', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          let trunkateAt = User.trunkateAt;

          if (User.socketid === socket.id /* verify socket id to avoid duplicating signal */) {
            trunkateAt += data.key;
          }

          await models.User.update(
            {
              trunkateAt: trunkateAt,
            },
            {where: {userName: data.userName}},
          );
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('saveToXLSX', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          app.get('/downloads/vocabulary_files', (req, res) => {
            const file = '/downloads/vocabulary_files/'+data.userName.replace(/\s/g, '-')+'-vocabulary-list.xlsx';

            res.download(path.join(__dirname + file), function(error) {
              console.log("Error : ", error)
            });
          });
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('saveToJSON', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          app.get('/downloads/known_characters', async (req, res) => {
            const file = '/downloads/known_characters/'+data.userName.replace(/\s/g, '-')+'-known-characters.json';

            const allKnownChars = await findAllKnownChars(data.userName);

            fs.writeFileSync(path.join(__dirname + file), JSON.stringify(allKnownChars));

            res.download(path.join(__dirname + file), function(error) {
              console.log("Error : ", error)
            });
          });
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('importJSON', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid && data.import) { // authentication
          const allKnownChars = await findAllKnownChars(data.userName);
          for (let i=0; i<allKnownChars.length; i++) {
            await removeKnownCharRelation(data.userName, allKnownChars[i]);
          }

          const knownCharsList = removeDuplicates(JSON.parse(data.import.toString()));
          for (let i=0; i<knownCharsList; i++) {
            await newKnownCharRelation(data.userName, knownCharsList[i]);
          }

          socket.emit('KnownCharactersAPI', knownCharsList);
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('clientinput', async (data) => {
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
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('resubmit', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          const totalChars = User.totalChars;

          const frequencies = await findAllCharacterFrequencies(User.id);
          const allTexts = await findAllTexts(User.id);
          const allWordsWithDefinitions = await findAllWordsWithDefinitions(data.userName);
          const allCharsWithDefinitions = await findAllCharsWithDefinitions(data.userName);

          socket.emit('ProgressBarAPI', 21);

          const trunkateAt = User.trunkateAt;

          const API = {
            text: allTexts,
            trunkateAt: trunkateAt,
            charsWithDefinitions: allCharsWithDefinitions,
            wordsWithDefinitions: allWordsWithDefinitions,
            totalChars: totalChars,
            charFrequency: frequencies,
          };
          socket.emit('processedInputAPI', API);
        }
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })

    socket.on('newhighlightedWord', async (data) => {
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
        else {
          console.log('')
          console.log('socket connectionToken: '+socket.connectionToken)
          console.log('User connectionToken: '+User.connectionToken)
          console.log('socket id: '+socket.id)
          console.log('User socketid: '+User.socketid)
          console.log('')
        }
      }
      catch(e) {
        console.log(e)
      }
    })
  });
}
