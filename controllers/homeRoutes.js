// These are the routes to send to the handlebar templates
const router = require('express').Router();
const session = require('express-session');
const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// this is needed for the homepage, which displays all posts whether
// or not the user is logged in. Note that only the summary is displayed
// on the homepage
router.get('/', async (req, res) => {
  try {
    // get all posts with the user info and comments
    // requires a nested join to get the user(s) who made the comment(s)
    const allPosts = await BlogPost.findAll({
      // first join gets the User who made the post
      attributes: [
        'id',
        'title',
        'summary',
        'createdAt',
        'updatedAt'
      ],
      include: {
        model: User,
        attributes: ['username']
      }
    });
    // return object array closer to what is required on the homepage
    const posts = allPosts.map(post => {
      const obj = {};
      obj.id = post.id;
      obj.title = post.title;
      obj.summary = post.summary;
      obj.username = post.user.username;
      obj.date = post.updatedAt;
      return obj;
    })
    res.render('homepage', { posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// users get to see the whole post and the comments on the post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    let output = {};
    // get all posts with the user info and comments
    // requires a nested join to get the user(s) who made the comment(s)
    const onePost = await BlogPost.findByPk(req.params.id, {
      attributes: { exclude: ['id', 'user_id'] },
      // first join gets the User who made the post
      include: [{
        model: User,
        attributes: ['username']
      }, {
        // second join gets all the comments on the post along with their users
        model: Comment,
        attributes: ['content', 'createdAt', 'updatedAt'],
        include: {
          model: User,
          attributes: ['username']
        }
      }]
    });
    // flatten output
    output.title = onePost.title;
    output.summary = onePost.summary;
    output.content = onePost.content;
    output.date = onePost.updatedAt;
    output.post_username = onePost.user.username;
    // output comments as object array since there may be more than one
    // const comments = onePost.comments.map(value => {
    output.comments = onePost.comments.map(value => {
      let obj = {};
      obj.content = value.content;
      obj.date = value.updatedAt;
      obj.username = value.user.username;
      return obj;
    });
    // output.comments = { comments };
    output.logged_in = req.session.logged_in;
    console.log(output);
    res.render('post', output);
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
