const {models, sequelize} = require('../src/models');

exports.newKnownCharRelation = async (userName, charName) => {
  let user;
  let char;

  user = await models.User.findByLogin(userName);
  if (!user) {
    user = await models.User.create({
      userName: userName,
    });
  }

  char = await models.KnownCharacter.findByCharName(charName);
  if (!char) {
    await models.KnownCharacter.create({
      known: charName,
    });
    char = await models.KnownCharacter.findByCharName(charName);
  }

  await user.addKnownCharacter(char, { through: models.CharRelation });
}

exports.removeKnownCharRelation = async (userName, charName) => {
  let user;
  let char;

  user = await models.User.findByLogin(userName);
  if (!user) {
    user = await models.User.create({
      userName: userName,
    });
  }

  char = await models.KnownCharacter.findByCharName(charName);
  if (!char) {
    await models.KnownCharacter.create({
      known: charName,
    });
    char = await models.KnownCharacter.findByCharName(charName);
  }

  await user.removeKnownCharacter(char, { through: models.CharRelation });
}

exports.newCharWithDefinitionRelation = async (userName, charTradi, charSimpl, charData) => {
  const user = await models.User.findByLogin(userName);

  if (user) {
    const tradi = await models.CharWithDefinition.findByCharTradiName(charTradi);
    const simpl = await models.CharWithDefinition.findByCharSimplName(charSimpl);

    if (!tradi && !simpl) {
      await models.CharWithDefinition.create({
        tradi: charTradi,
        simpl: charSimpl,
        data: charData,
      });
    }

    const char = await models.CharWithDefinition.findByCharTradiName(charTradi);

    await user.addCharWithDefinition(char, { through: models.CharWithDefinitionRelation });
  }
}

exports.removeCharWithDefinitionRelation = async (userName, charTradi) => {
  const user = await models.User.findByLogin(userName);

  if (user) {
    const char = await models.CharWithDefinition.findByCharTradiName(charTradi);
    await user.removeCharWithDefinition(char, { through: models.CharWithDefinitionRelation });
  }
}

exports.newWordWithDefinitionRelation = async (userName, wordName, wordData) => {
  const user = await models.User.findByLogin(userName);

  if (user) {
    const wordExists = await models.WordWithDefinition.findByWordName(wordName);

    if (!wordExists) {
      await models.WordWithDefinition.create({
        word: wordName,
        data: wordData,
      });
    }

    const word = await models.WordWithDefinition.findByWordName(wordName);

    await user.addWordWithDefinition(word, { through: models.WordWithDefinitionRelation });
  }
}

exports.removeWordWithDefinitionRelation = async (userName, wordName) => {
  const user = await models.User.findByLogin(userName);

  if (user) {
    const word = await models.WordWithDefinition.findByWordName(wordName);
    await user.removeWordWithDefinition(word, { through: models.WordWithDefinitionRelation });
  }
}
