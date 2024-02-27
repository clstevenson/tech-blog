/*
 * Comments have a poster (ie they belong to a user), a date, and content.
 * They also belong to a single blogpost. Thus, two FKs are needed, one for
 * the user and one for the post.
 */

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'blogpost',
        key: 'id'
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;
