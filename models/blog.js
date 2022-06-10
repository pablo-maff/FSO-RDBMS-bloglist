const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1991],
          msg: 'BlogYearValidationError',
        },
        max: {
          args: [2022],
          msg: 'BlogYearValidationError',
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'blog',
  }
)

module.exports = Blog
