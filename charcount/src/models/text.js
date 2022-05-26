const getTextModel = (sequelize, { DataTypes }) => {
  const Text = sequelize.define(
    'Text',
    {
      text: {
        type: DataTypes.ARRAY(DataTypes.JSON(DataTypes.STRING)),
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false }
  );

  Text.associate = (models) => {
    Text.belongsTo(models.User);
  };

  return Text;
};

exports.getTextModel = getTextModel;
