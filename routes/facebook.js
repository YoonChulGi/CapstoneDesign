var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');
var UserSchema;
var UserModel ; 


module.exports = function (app,passport) {
	
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields : ['id','email','name'],
	},function (accessToken,refreshToken,profile,done){
		console.log('passport의 facebook 호출됨');
		console.log('accessToken: '+accessToken);
		console.log('refreshToken: '+refreshToken);
		console.log('profile');
		console.dir(profile);
		
		var options = {
			criteria:{'facebook.id':profile.id}
		};
		
		let database = app.get('database');
		UserModel = app.get('UserModel');
		UserModel.findOne({userID:profile.id},function(err,user){
			if(err) return done(err);
			if(!user) {
				var user = new UserModel({
					userID: profile.id,
					name: profile.displayName,
					email: profile.emails[0].value,
					provider: 'facebook',
					facebook: profile._json
				});
				user.save(function(err){
					if(err)console.log(err);
					return done(err,user);
				});
			}else {
				return done(err,user);
			}
		});
	});
};
