///////////////////////////////////////////////////////////////////////////////
//                             Comment API Routes                            //
///////////////////////////////////////////////////////////////////////////////

/*
 * APIs to create, delete, or edit comments on blog posts.
 * Users are only allowed to perform these operations on their
 * own comments.
 */

const router = require('express').Router();
const session = require('express-session');
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// users can post comments on any post
// req.body should contain both comment content and the post_id
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create(
      {
        user_id: req.session.user_id,
        ...req.body
      }
    );
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// users can edit their own comments
router.put('/:id', withAuth, async (req, res) => {
  try {
    // validation that the comment by the user exists
    const getComment = await Comment.findByPk(req.params.id);

    if (!getComment) {
      res.status(400).json("Error: comment with that ID does not exist");
      return;
    } else if (getComment.user_id !== req.session.user_id) {
      res.status(400).json("Error: user not authorized to edit this comment");
      return;
    }

    // should only need to update the content
    const updateComment = await Comment.update(req.body, {
      where: { id: req.params.id, user_id: req.session.user_id }
    });

    res.status(200).json(updateComment);

  } catch (err) {
    res.status(500).json(err);
  }
});

// users can delete their own comments
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deleteComment = await Comment.destroy({
      where: { id: req.params.id, user_id: req.session.user_id }
    });

    if (deleteComment) {
      res.status(200).json(`Comment ${req.params.id} deleted`);
    } else {
      res.status(400).json(
        `Couldn't find comment ${req.params.id} by user ${req.session.user_id}`
      );
    }
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
