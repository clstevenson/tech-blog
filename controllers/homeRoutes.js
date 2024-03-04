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
    res.render('homepage', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// logged-in users get to see the whole post and the comments on the post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    let output = {};
    // get all posts with the user info and comments
    // requires a nested join to get the user(s) who made the comment(s)
    const onePost = await BlogPost.findByPk(req.params.id, {
      attributes: { exclude: ['user_id'] },
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
    output.postID = onePost.id;
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
    // make sure handlebars knows we are logged in
    output.logged_in = req.session.logged_in;
    res.render('showpost', output);
  } catch (err) {
    res.status(500).json(err);
  }
});

// logged-in users get to see a dashboard that contains their posts and comments
router.get('/dashboard', withAuth, async (req, res) => {
  // get a list of all posts by the logged-in user with option to edit or delete
  const userPosts = await BlogPost.findAll({
    attributes: ['id', 'title', 'summary', 'content', ['updated_at', 'date']],
    where: { user_id: req.session.user_id }
  });

  // serialize output
  const posts = userPosts.map(post => post.get({ plain: true }));

  // get a list of all comments by the user, with option to edit or delete
  const userComments = await Comment.findAll({
    attributes: ['id', 'content', 'post_id', ['created_at', 'date']],
    where: { user_id: req.session.user_id },
    include: {
      model: BlogPost,
      attributes: [['id', 'post-id'], 'title']
    }
  });

  // serialize output
  const comments = userComments.map(comment => comment.get({ plain: true }));

  // need the username for the greeting
  const user = await User.findByPk(req.session.user_id, {
    attributes: ['username']
  });

  // combine them into an object and send to handlebars
  res.render('dashboard', { posts, comments, username: user.username, logged_in: req.session.logged_in });
});

// the login page allows users to log in or create a new account
router.get('/login', async (req, res) => {
  // if user it logged in already, go to home page
  if (req.session.logged_in) {
    res.redirect('/dashboard', { logged_in: req.session.logged_in });
    return;
  }
  // otherwise render the login page
  res.render('login');
});

// need route to add a post
// I think just send them to the page with the user_ID
router.get('/addpost', withAuth, (req, res) => {
  try {
    res.render('createpost', {logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

// need route to edit an existing post
// need to get info on the post and serve it to the handlebars template
router.get('/editpost/:id', withAuth, async (req, res) => {
  try {
    // get the current data for the post
    const postData = await BlogPost.findByPk(req.params.id);
    const output = {
      logged_in: req.session.logged_in,
      edit: true,
      post_id: req.params.id,
      title: postData.title,
      summary: postData.summary,
      content: postData.content
    };
    res.render('editpost', output);
  } catch (err) {
    res.status(500).json(err);
  }
});

// need route to add a comment
// I think just send them to the page with the user_ID
router.get('/addcomment', withAuth, (req, res) => {

});

// need route to edit an existing comment
// need to get info on the comment and serve it to the handlebars template
router.get('/editcomment/:id', withAuth, async (req, res) => {

});

module.exports = router;
