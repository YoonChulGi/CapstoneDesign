var express = require('express');
var route = express.Router();
var user = require('./user');
var passport = user.passport;

//패스포트 - 페이스북 인증 콜백 라우팅
route('/facebook/callback').get(passport.authenticate('facebook',{
	successRedirect: '/index',
	failureRedirect: '/loginfailed'
}));

module.exports = route;