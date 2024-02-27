const sequelize = require('../config/connection');
const { User, BlogPost, Comment } = require('../models/index.js');

const userData = require('./userData.json');
const blogpostData = require('./blogpostData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  // create the tables, overwriting if necessary
  await sequelize.sync({ force: true });

  // users table
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // blog posts with random user IDs
  for (const post of blogpostData) {
    await BlogPost.create({
      ...post,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  // need the array of posts we just created
  const allPosts = await BlogPost.findAll();

  // seed comments with randonly generated user IDs and post IDs
  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      post_id: allPosts[Math.floor(Math.random() * allPosts.length)].id,
    })
  }

  process.exit(0);
};

seedDatabase();
