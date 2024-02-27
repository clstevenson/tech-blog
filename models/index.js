/*
 * There are three DB tables: users, blogposts, and comments
 * - users can post blogposts and can comment on other blogposts
 * - a single user can have multiple posts and multiple comments,
 * but a given post or comment belongs to a single user
 * - a blogpost can have multiple comments, but a given comment will
 * be directed at (ie, belong to) a single post
 */

const User = require('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');

User.hasMany(BlogPost, {
  foreignKey: 'user_id'
});
BlogPost.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

BlogPost.hasMany(Comment, {
  foreignKey: 'post_id'
});
Comment.belongsTo(BlogPost, {
  foreignKey: 'post_id'
});

module.exports = {
  BlogPost,
  Comment,
  User,
};
