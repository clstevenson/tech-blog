///////////////////////////////////////////////////////////////////////////////
//                            Index of All Routes                            //
///////////////////////////////////////////////////////////////////////////////

/*
 * API routes involving CRUD operations have the '/api' prefix.
 * The are defined in the api folder and collected in /api/index.js
 *
 * Home routes that render content are defined in the homeRoutes.js file
 */

const router = require('express').Router();

const apiRoutes = require('./api');
router.use('/api', apiRoutes);

const homeRoutes = require('./homeRoutes');
router.use('/', homeRoutes);

module.exports = router;
