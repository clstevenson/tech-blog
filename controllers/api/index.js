// routes serving the data (API routes)
const router = require('express').Router();
const blogpostRoutes = require('./blogpostRoutes');
const userRoutes = require('./userRoutes');

router.use('/blogposts', blogpostRoutes);
router.use('/users', userRoutes);

module.exports = router;
