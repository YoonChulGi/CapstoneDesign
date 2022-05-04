var express = require('express');
var route = express.Router();
var user = require('./user');
var passport = user.passport;

//패스포트 - 페이스북 인증 라우팅
route.route('/facebook').get(passport.authenticate('facebook',{
	scope: 'email'
}));
route.route('/facebook/callback').get(passport.authenticate('facebook',{
	//callbackURL: '/auth/facebook/callback',
	successRedirect : '/index',
	failureRedirect : '/'
}));



module.exports = route;