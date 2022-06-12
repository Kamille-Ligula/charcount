// not using this function right now but might want to in the future:
const isEmailValid = (value) => {
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return pattern.test(value.toLowerCase());
};

const eraseDatabaseOnSync = false;

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
  const { recoveryPasswordTimeout } = require("./lib/timeouts");
  const { sendEmail } = require("./lib/sendEmail");
  const { createRandomString } = require("./lib/createRandomString");
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
    findRecoveryPassword,
  } = require("./lib/requeststoDB");

  const {models, sequelize} = require('./src/models');

  sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => { if (eraseDatabaseOnSync) {/* do stuff */} });

  io.use(async (socket, next) => { // register
    try {
      const data = JSON.parse(socket.handshake.auth.token);

      if (data.connectionType === 'register') {
        if (data.userName && data.email && data.password) {
          const User = await models.User.findByLogin(data.userName);
          const Email = await models.User.findByLogin(data.email);

          if (!User) {
            if (!Email) {
              const randomString = createRandomString('', 48, 32, 2);

              app.get('/'+randomString, async (req, res) => {
                res.send('Your account was successfully created! You can now close this window and proceed to logging in in order to use Charcount.')

                await models.User.create(
                  {
                    userName: data.userName,
                    email: data.email,
                    password: data.password,
                  },
                );
              });

              const emailSubject = 'Confirm your Charcount email address';
              const emailText = `Hi, ${data.userName}, <p/> Please confirm your registration email address on
                Charcount by clicking this link: <p/>
                <a href=${process.env.CLIENT_ENDPOINT}/${randomString}>${process.env.CLIENT_ENDPOINT}/${randomString}</a>
                <p/>If you didn't request this email, please simply ignore it.
                `;
              sendEmail(emailSubject, emailText, data.email);

              socket.emit('ConnectionFeedbackAPI', 'We sent you a confirmation email from the address miranteule@gmail.com. Please follow the instructions inside in order to complete your registration.');
            }
            else {
              socket.emit('ConnectionFeedbackAPI', 'This email address has already been registered to another account.');
            }
          }
          else {
            socket.emit('ConnectionFeedbackAPI', 'This name has already been registered to another account.');
          }
        }
        else {
          socket.emit('ConnectionFeedbackAPI', 'Please fill in all the fields.');
        }
      }
    }
    catch(e) {
      console.log(e)

      socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
    }

    next();
  })

  io.use(async (socket, next) => { // login
    try {
      const data = JSON.parse(socket.handshake.auth.token);

      let user = await models.User.findByLogin(data.userName);

      if (data.connectionType === 'login') {
        if (user) {
          if (data.password) {
            const matchPasswords = await bcrypt.compare(data.password, user.password);

            if (matchPasswords) {
              socket.connectionToken = data.connectionToken;

              io.to(user.socketid).emit("kickedOut_charcountAPI", 'You can only be connected in one place at a time. You were disconnected from here because you connected elsewhere. If it wasn\'t you please make sure your connection is safe.');

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

              io.to(user.socketid).emit("kickedOut_charcountAPI", 'Someone logged in with your identifiers. If it wasn\'t you please make sure your connection is safe.');

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
            socket.emit('ConnectionFeedbackAPI', 'Wrong identifiers');
          }
        }
        else {
          socket.emit('ConnectionFeedbackAPI', 'Wrong identifiers');
        }
      }
    }
    catch(e) {
      console.log(e)

      socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
    }

    next();
  })

  io.use(async (socket, next) => { // recover
    try {
      const data = JSON.parse(socket.handshake.auth.token);

      const User = await models.User.findByLogin(data.userName);

      if (data.connectionType === 'recover') {
        if (User) {
          const randomString = createRandomString('', 16, 16, 2);

          const emailSubject = 'Charcount account recovery';
          const emailText = `Hi, ${User.userName}.
            <p/> You requested a password change on
            Charcount. You can use the below recovery password in order to reset your log in password:
            <p/>Your user name: ${User.userName}
            <br/>Your recovery password: ${randomString}
            <p/>This recovery password will expire in ${recoveryPasswordTimeout.english}.
            <p/>If you didn't request this email, please simply ignore it.
            `;
          sendEmail(emailSubject, emailText, User.email);

          await models.RecoveryPassword.destroy({ where: { userId: User.id } });
          await models.RecoveryPassword.create(
            {
              text: randomString,
              userId: User.id,
            },
          );

          socket.emit('ConnectionFeedbackAPI', 'We sent you a recovery email from the address miranteule@gmail.com to your address '+User.email+'. Please follow the instructions inside in order to recover your account.');
        }
        else {
          socket.emit('ConnectionFeedbackAPI', 'Your input doesn\'t match any user or email address from the database. Please make sure you didn\'t type it wrong');
        }
      }
    }
    catch(e) {
      console.log(e)

      socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
    }

    next();
  })

  io.use(async (socket, next) => { // reset
    try {
      const data = JSON.parse(socket.handshake.auth.token);

      const User = await models.User.findByLogin(data.userName);

      if (data.connectionType === 'reset') {
        if (User) {
          const recoveryPassword = await findRecoveryPassword(User.id);
          if (recoveryPassword && recoveryPassword.text && recoveryPassword.text.length > 0) {
            if (data.recoveryPassword === recoveryPassword.text &&
            Date.now() - recoveryPassword.updatedAt.getTime() < recoveryPasswordTimeout.maths) {
              await models.User.update(
                {
                  password: data.password,
                },
                {where: {userName: User.userName}},
              );
              await models.RecoveryPassword.destroy({ where: { userId: User.id } });
              socket.emit('ConnectionFeedbackAPI', 'Your password was successfully reset. You can now use it to sign in.');
            }
            else {
              socket.emit('ConnectionFeedbackAPI', 'Either your recovery password doesn\'t match the one we sent to you by email, or it expired. Remember that recovery passwords are only available for a certain amount of time.');
            }
          }
          else {
            socket.emit('ConnectionFeedbackAPI', 'Please enter the recovery password that was sent to you by email at '+models.User.email+'.');
          }
        }
        else {
          socket.emit('ConnectionFeedbackAPI', 'Please make sure you didn\'t type your name wrong.');
        }
      }
    }
    catch(e) {
      console.log(e)

      socket.emit('ConnectionFeedbackAPI', 'Something went wrong. Try again.');
    }

    next();
  })

  io.on("connection", async (socket) => {
    socket.on('clientSendKnownChar', async (data) => {
      try {
        const User = await models.User.findByLogin(data.userName);

        if (socket.connectionToken === User.connectionToken && socket.id === User.socketid) { // authentication
          await newKnownCharRelation(data.userName, data.newKnownCharacter);
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
          for (let i=0; i<knownCharsList.length; i++) {
            await newKnownCharRelation(data.userName, knownCharsList[i]);
          }

          socket.emit('KnownCharactersAPI', knownCharsList);
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
      }
      catch(e) {
        console.log(e)
      }
    })
  });
}
