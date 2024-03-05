///////////////////////////////////////////////////////////////////////////////
//                              User API Routes                              //
///////////////////////////////////////////////////////////////////////////////

/*
 * APIs to create a new user, to authenticate an existing user, and to log out
 * (Arguably the latter two should be in home routes?)
 */

const router = require('express').Router();
const { User } = require('../../models');
const { Op } = require('sequelize');

// create new user: /api/users POST route
// input username, email, and password as JSON
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Check login input against User table in DB
// Full route will be /api/users/login
// Submit username/password (but username can be email address)
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        // user may input either username or password on login form
        [Op.or]: [{email: req.body.username}, {username: req.body.username}]
      }
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Could not find username/email' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Logging out destroys the session/cookie
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
