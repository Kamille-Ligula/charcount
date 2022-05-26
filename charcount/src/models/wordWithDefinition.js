const getWordWithDefinitionModel = (sequelize, { DataTypes }) => {
  const WordWithDefinition = sequelize.define(
    'WordWithDefinition',
    {
      word: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      data: {
        type: "varchar(50000)",
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false }
  );

  WordWithDefinition.findByWordName = async (wordName) => {
    let data = await WordWithDefinition.findOne({
      where: { word: wordName },
    });

    return data;
  };

  WordWithDefinition.associate = (models) => {
    WordWithDefinition.belongsToMany(models.User, { through: models.WordWithDefinitionRelation });
  };

  return WordWithDefinition;
};

const getWordWithDefinitionRelationModel = (sequelize, { DataTypes }) => {
  const WordWithDefinitionRelation = sequelize.define(
    "WordWithDefinitionRelation",
    {},
    { timestamps: false }
  );

  WordWithDefinitionRelation.associate = (models) => {
    WordWithDefinitionRelation.belongsTo(models.User);
  };

  return WordWithDefinitionRelation;
};

exports.getWordWithDefinitionModel = getWordWithDefinitionModel;
exports.getWordWithDefinitionRelationModel = getWordWithDefinitionRelationModel;
