const bcrypt = require('bcrypt');

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define(
    'user',
    {
      userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        set(value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        },
      },

      trunkateAt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      socketid: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      connectionToken: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      /*methodOfAnalysis: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },*/
      totalChars: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    { timestamps: false },
    /*{
      freezeTableName: true,
      instanceMethods: {
        generateHash(password) {
          return bcrypt.hash(password, bcrypt.genSaltSync(8));
        },
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        }
      }
    }*/
  );

  User.associate = (models) => {
    User.hasMany(models.Text, { onDelete: 'CASCADE' });
    User.hasMany(models.CharFrequency, { onDelete: 'CASCADE' });
    User.hasMany(models.HighlightedWord, { onDelete: 'CASCADE' });
    User.belongsToMany(models.WordWithDefinition, { through: models.WordWithDefinitionRelation });
    User.belongsToMany(models.CharWithDefinition, { through: models.CharWithDefinitionRelation });
    User.belongsToMany(models.KnownCharacter, { through: models.KnownCharRelation });
  };

  User.findByLogin = async (login) => {
    let user = await User.findOne({
      where: { userName: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  return User;
};

exports.getUserModel = getUserModel;
