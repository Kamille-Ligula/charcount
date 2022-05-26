const getKnownCharacterModel = (sequelize, { DataTypes }) => {
  const KnownCharacter = sequelize.define(
    'KnownCharacter',
    {
      known: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false }
  );

  KnownCharacter.findByCharName = async (charName) => {
    let data = await KnownCharacter.findOne({
      where: { known: charName },
    });

    return data;
  };

  KnownCharacter.associate = (models) => {
    KnownCharacter.belongsToMany(models.User, { through: models.KnownCharRelation });
  };

  return KnownCharacter;
};

const getKnownCharRelationModel = (sequelize, { DataTypes }) => {
  const KnownCharRelation = sequelize.define(
    'KnownCharRelation',
    {},
    { timestamps: false }
  );

  KnownCharRelation.associate = (models) => {
    KnownCharRelation.belongsTo(models.User);
  };

  return KnownCharRelation;
};

exports.getKnownCharacterModel = getKnownCharacterModel;
exports.getKnownCharRelationModel = getKnownCharRelationModel;
