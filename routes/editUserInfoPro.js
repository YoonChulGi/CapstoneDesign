var express = require('express');
var route = express.Router();
var user = require('./user');
var passport = user.passport;

route.get('/', (req,res) => {
	console.log('editUserInfoPro...get');
	//console.log('render: ');
    //res.render('complete');
});

route.post('/',passport.authenticate('local-pwcheck',{
	successRedirect : '/editUserInfoSuccess',
	failureRedirect : '/loginfailed',
	failureFlash: true,
}));

module.exports = route;