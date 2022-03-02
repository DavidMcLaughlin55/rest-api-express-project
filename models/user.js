'use strict';
const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Course, {
        foreignKey: 'userId',
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name is required.',
        },
        notEmpty: {
          msg: 'Please provide a first name.',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last name is required',
        },
        notEmpty: {
          msg: 'Please provide a last name.',
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An email is required.',
        },
        isEmail: {
          msg: 'Please provide a valid email address.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.',
        },
        notEmpty: {
          msg: 'Please provide a password.',
        },
        len: {
          args: [8, 20],
          message: 'The password should be between 8 and 20 characters in length.',
        },
        // Encrypt Password
        set(password) {
          if (password) {
            const passwordHash = bcrypt.hashSync(password, 10);
            this.setDataValue('password', passwordHash);
          }
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};