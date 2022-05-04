var KaKaoStrategy = require('passport-kakao').Strategy;
var config = require('../config');
var UserSchema;
var UserModel ; 


module.exports = function (app,passport) {
	
	return new KaKaoStrategy({
		clientID: config.kakaotalk.clientID,
		clientSecret: config.kakaotalk.clientSecret,
		callbackURL: config.kakaotalk.callbackURL,
	},function (accessToken,refreshToken,profile,done){
		console.log('passport의 kakaotalk 호출됨');
		console.log('accessToken: '+accessToken);
		console.log('refreshToken: '+refreshToken);
		console.log('profile');
		console.dir(profile);
		
		let database = app.get('database');
		UserModel = app.get('UserModel');
		UserModel.findOne({userID:profile.id},function(err,user){
			if(err) return done(err);
			if(!user) {
				var JSONObject = JSON.parse(profile._raw);
				console.dir(JSONObject);
				console.log('!user');
				console.log('userID: '+profile.id);
				
				console.log('email: '+JSONObject.kaccount_email);
				console.log('kakao: ');
				
				console.dir(profile._json);
				var user = new UserModel({
					userID: profile.id,
					username: profile.displayName,
					email: JSONObject.kaccount_email,
					provider: 'kakao',
					kakao: JSONObject
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