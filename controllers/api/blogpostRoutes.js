const router = require('express').Router();
const session = require('express-session');
const { BlogPost, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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
    const output = allPosts.map(post => {
      const obj = {};
      let date;
      obj.title = post.title;
      obj.summary = post.summary;
      obj.username = post.user.username;
      // return the more recent date (created vs updated)
      if (post.updatedAt > post.createdAt) date = post.updatedAt;
      else date = post.createdAt;
      obj.date = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
      return obj;
    })
    res.status(200).json(output);
  } catch (err) {
    res.status(500).json(err);
  }
});

// when a user who is logged in clicks on a post title,
// they are presented with the post and all comments on the post
// along with the users who created the post and the comments
router.get('/:id', withAuth, async (req, res) => {
  try {
    // get all posts with the user info and comments
    // requires a nested join to get the user(s) who made the comment(s)
    const allPosts = await BlogPost.findByPk(req.params.id, {
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
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// user creates a new blog post
// input object: title, summary, content
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await BlogPost.create(
      // user ID from session, rest is from submission form
      {
        user_id: req.session.user_id,
        ...req.body
      }
    );
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post deletion
// validation: only allow a user to delete their own posts
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletePost = await BlogPost.destroy({
      where: { id: req.params.id, user_id: req.session.user_id }
    });
    console.log(deletePost);
    if (deletePost) res.status(200).json("Post ${req.params.id} deleted");
    else res.status(400).json(`Couldn't find post ${req.params.id} by user ${req.session.user_id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Allow users to edit a post
// req.body should contain updated title, summary, and content
// validate that there is a post by the logged-in user
router.put('/:id', withAuth, async (req, res) => {
  try {
    // validation that a post by the user exists with the submitted ID
    const postID = req.params.id;
    const userID = req.session.user_id;

    const getPost = await BlogPost.findByPk(postID);

    if (!getPost) {
      res.status(400).json("Error: post with that ID does not exist");
      return;
    } else if (getPost.user_id !== userID) {
      res.status(400).json("Error: user not authorized to delete this post");
      return;
    };

    // update post title, summary, and/or content
    const updatePost = await BlogPost.update(req.body, {
      where: { id: postID }
    });
    res.status(200).json(updatePost);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
