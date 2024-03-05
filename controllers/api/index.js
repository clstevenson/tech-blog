///////////////////////////////////////////////////////////////////////////////
//                                 API Routes                                //
///////////////////////////////////////////////////////////////////////////////

// These are routes that allow CRUD operations.
// Many of these require a user to be logged in and limit their
// scope to content created by the user

const router = require('express').Router();
const blogpostRoutes = require('./blogpostRoutes');
const userRoutes = require('./userRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/blogposts', blogpostRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
