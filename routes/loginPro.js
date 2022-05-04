var express = require('express');
var route = express.Router();
var user = require('./user');
var passport = user.passport;

route.post('/',passport.authenticate('local-login',{
	successRedirect : '/index',
	failureRedirect : '/loginfailed',
	failureFlash: true,
}));
module.exports = route;