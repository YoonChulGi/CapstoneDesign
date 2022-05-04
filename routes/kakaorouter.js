var express = require('express');
var route = express.Router();
var user = require('./user');
var passport = user.passport;

//패스포트 - 카카오 인증 라우팅
route.route('/kakao').get(passport.authenticate('kakaotalk'));
route.route('/kakao/callback').get(passport.authenticate('kakaotalk',{
	successRedirect : '/index',
	failureRedirect : '/'
}));
module.exports = route;