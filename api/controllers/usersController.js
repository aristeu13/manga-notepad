'use strict';

const User = require('../models/usersModel');
const crypto = require('crypto');

exports.create_new_user = function(req, res, next) {
  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");

  req.body.password = salt + "$" + hash;

  User.saveToDB(req.body)
    .then((result) => {
      req.body = {
        userId: result._id,
        email: result.email,
        permissionLevel: result.permissionLevel,
        name: result.name,
      }
      next();
    });
  }

exports.list_all_users = function(req, res) {
  User.list()
    .then((result) => {
      res.status(200).send(result)
    });
}