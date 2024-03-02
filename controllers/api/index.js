// routes serving the data (API routes)
const router = require('express').Router();
const blogpostRoutes = require('./blogpostRoutes');
const userRoutes = require('./userRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/blogposts', blogpostRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
