const {models, sequelize} = require('../src/models');

exports.findAllKnownCharacters = async (userName) => {
  const user = await models.User.findOne({
    where: { userName: userName },
    include: models.KnownCharacter
  });
  const data = [];
  for (i=0; i<user.KnownCharacters.length; i++) {
    data.push(user.KnownCharacters[i].known)
  }

  return data;
}

exports.findAllHighlightedWords = async (userId) => {
  const HighlightedWords = await models.HighlightedWord.findAll({
    where: { userId: userId },
  });

  const data = [];
  for (i=0; i<HighlightedWords.length; i++) {
    data.push(HighlightedWords[i].highlighted)
  }

  return data;
}

exports.findAllCharacterFrequencies = async (userId) => {
  const CharFrequency = await models.CharFrequency.findAll({
    where: { userId: userId },
  });

  const data = [];
  for (i=0; i<CharFrequency.length; i++) {
    data.push({
      character: CharFrequency[i].character,
      occurences: CharFrequency[i].occurences,
    })
  }

  return data;
}

exports.findAllTexts = async (userId) => {
  const Texts = await models.Text.findAll({
    where: { userId: userId },
  });

  const data = [];
  for (i=0; i<Texts.length; i++) {
    data.push(Texts[i].text)
  }

  return data;
}

exports.findAllWordsWithDefinitions = async (userName) => {
  const user = await models.User.findOne({
    where: { userName: userName },
    include: models.WordWithDefinition
  });

  const data = [];
  for (i=0; i<user.WordWithDefinitions.length; i++) {
    data.push(JSON.parse(user.WordWithDefinitions[i].data))
  }

  return data;
}

exports.findAllCharsWithDefinitions = async (userName) => {
  const user = await models.User.findOne({
    where: { userName: userName },
    include: models.CharWithDefinition
  });

  const data = [];
  for (i=0; i<user.CharWithDefinitions.length; i++) {
    data.push(JSON.parse(user.CharWithDefinitions[i].data))
  }

  return data;
}

exports.findAllKnownChars = async (userName) => {
  const user = await models.User.findOne({
    where: { userName: userName },
    include: models.KnownCharacter
  });

  const data = [];
  for (i=0; i<user.KnownCharacters.length; i++) {
    data.push(user.KnownCharacters[i].known)
  }

  return data;
}
