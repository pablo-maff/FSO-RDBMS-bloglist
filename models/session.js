const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    sessionToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // disabled: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    //   references: { model: 'users', key: 'disabled' },
    // },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'session',
  }
)

module.exports = Session
