const getCharFrequencyModel = (sequelize, { DataTypes }) => {
  const CharFrequency = sequelize.define(
    'CharFrequency',
    {
      character: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      occurences: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false }
  );

  CharFrequency.associate = (models) => {
    CharFrequency.belongsTo(models.User);
  };

  return CharFrequency;
};

exports.getCharFrequencyModel = getCharFrequencyModel;
