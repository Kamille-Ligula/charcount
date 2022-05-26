const getCharWithDefinitionModel = (sequelize, { DataTypes }) => {
  const CharWithDefinition = sequelize.define(
    'CharWithDefinition',
    {
      tradi: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      simpl: {
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

  CharWithDefinition.findByCharTradiName = async (charName) => {
    let data = await CharWithDefinition.findOne({
      where: { tradi: charName },
    });

    return data;
  };

  CharWithDefinition.findByCharSimplName = async (charName) => {
    let data = await CharWithDefinition.findOne({
      where: { simpl: charName },
    });

    return data;
  };

  CharWithDefinition.associate = (models) => {
    CharWithDefinition.belongsToMany(models.User, { through: models.CharWithDefinitionRelation });
  };

  return CharWithDefinition;
};

const getCharWithDefinitionRelationModel = (sequelize, { DataTypes }) => {
  const CharWithDefinitionRelation = sequelize.define(
    "CharWithDefinitionRelation",
    {},
    { timestamps: false }
  );

  CharWithDefinitionRelation.associate = (models) => {
    CharWithDefinitionRelation.belongsTo(models.User);
  };

  return CharWithDefinitionRelation;
};

exports.getCharWithDefinitionModel = getCharWithDefinitionModel;
exports.getCharWithDefinitionRelationModel = getCharWithDefinitionRelationModel;
