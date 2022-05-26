const Sequelize = require("sequelize");

const {getUserModel} = require('./user');
const {getTextModel} = require('./text');
const {
  getKnownCharacterModel,
  getKnownCharRelationModel,
} = require('./knownCharacter');
const {getCharFrequencyModel} = require('./charFrequency');
const {getHighlightedWordModel} = require('./highlightedWord');
const {
  getWordWithDefinitionModel,
  getWordWithDefinitionRelationModel,
} = require('./wordWithDefinition');
const {
  getCharWithDefinitionModel,
  getCharWithDefinitionRelationModel,
} = require('./charWithDefinition');

const sequelize = new Sequelize(
  process.env.CHARCOUNT_DATABASE,
  process.env.CHARCOUNT_DATABASE_USER,
  process.env.CHARCOUNT_DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Text: getTextModel(sequelize, Sequelize),
  KnownCharacter: getKnownCharacterModel(sequelize, Sequelize),
  CharFrequency: getCharFrequencyModel(sequelize, Sequelize),
  HighlightedWord: getHighlightedWordModel(sequelize, Sequelize),
  WordWithDefinition: getWordWithDefinitionModel(sequelize, Sequelize),
  CharWithDefinition: getCharWithDefinitionModel(sequelize, Sequelize),
  KnownCharRelation: getKnownCharRelationModel(sequelize, Sequelize),
  CharWithDefinitionRelation: getCharWithDefinitionRelationModel(sequelize, Sequelize),
  WordWithDefinitionRelation: getWordWithDefinitionRelationModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

exports.sequelize = sequelize;
exports.models = models;
