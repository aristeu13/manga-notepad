'use strict';
module.exports = function(app) {
  const Users = require('./controllers/usersController');
  const Auth = require('./controllers/authController')
  const sanitize = require('./security')

  app.post('/login', Auth.checkingUserPassword, Auth.generatorHash);
  app.post('/register', Users.create_new_user, Auth.generatorHash);
  app.get('/users',sanitize('POST',"ola"), Auth.loginRequired, Users.list_all_users);

};
