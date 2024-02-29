const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
require('dotenv').config();

// server port
const PORT = process.env.PORT || 3001;
// import sequelize connection
const sequelize = require('./config/connection');
// create session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

// session options
const sess = {
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// use session middleware
app.use(session(sess));

// use encoding middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use all routes in the controllers folder
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
})
