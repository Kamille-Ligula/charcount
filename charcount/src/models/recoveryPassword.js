const getRecoveryPasswordModel = (sequelize, { DataTypes }) => {
  const RecoveryPassword = sequelize.define(
    'RecoveryPassword',
    {
      text: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  RecoveryPassword.associate = (models) => {
    RecoveryPassword.belongsTo(models.User);
  };

  return RecoveryPassword;
};

exports.getRecoveryPasswordModel = getRecoveryPasswordModel;
