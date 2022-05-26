const getHighlightedWordModel = (sequelize, { DataTypes }) => {
  const HighlightedWord = sequelize.define(
    'HighlightedWord',
    {
      highlighted: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false }
  );

  HighlightedWord.associate = (models) => {
    HighlightedWord.belongsTo(models.User);
  };

  return HighlightedWord;
};

exports.getHighlightedWordModel = getHighlightedWordModel;
