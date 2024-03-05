///////////////////////////////////////////////////////////////////////////////
//                            Blogpost API Routes                            //
///////////////////////////////////////////////////////////////////////////////

/*
 * APIs to create, delete, or edit blog posts.
 * Users are only allowed to perform these operations on their
 * own posts.
 */

const router = require('express').Router();
const session = require('express-session');
const { BlogPost, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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

    if (deletePost) {
      res.status(200).json(`Post ${req.params.id} deleted`);
    } else {
      res.status(400).json(`Couldn't find post ${req.params.id} by user ${req.session.user_id}`);
    };

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
      res.status(400).json("Error: user not authorized to edit this post");
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
