let database;
let UserSchema;
let UserModel;

let passport = require('passport');
let flash = require('connect-flash');
let facebook = require('./facebook');
let kakaotalk = require('./kakaotalk');
let LocalStrategy = require('passport-local').Strategy;

passport.use('local-login',new LocalStrategy({
	usernameField : 'username1',
	passwordField : 'password',
	session : true,
	passReqToCallback : true,
},function(req,userID,password,done){
	console.log('password의 local-login 호출됨' + userID + ',' + password);
	
	UserModel.findById(userID,function(err,results){
		console.log('passport  -  local-login');
		if(err) {return done(err);}
		if(!results){
			console.log('계정이 일치하지 않음.');
			return done(null,false,req.flash('loginMessage','등록된 계정이 없습니다.'));
		}
		var authenticated = results[0].authenticate(password,results[0]._doc.salt,results[0]._doc.hashed_password);
		if(!authenticated) {
			console.log('비밀번호 일치하지 않음.');
			return done(null,false,req.flash('loginMessage','비밀번호가 일치하지 않습니다.'));
		}
		// 정상인 경우
		console.log('계정과 비밀번호가 일치함.');
		return done(null,results);
	});
}));

passport.use('local-pwcheck',new LocalStrategy({
	usernameField : 'userID',
	passwordField : 'pw',
	session : true,
	passReqToCallback : true,
},function(req,userID,password,done){
	console.log('password의 local-pwcheck 호출됨' + userID + ',' + password);
	
	UserModel.findById(userID,function(err,results){
		console.log('passport  -  local-pw');
		if(err) {return done(err);}
		
		var authenticated = results[0].authenticate(password,results[0]._doc.salt,results[0]._doc.hashed_password);
		if(!authenticated) {
			console.log('비밀번호 일치하지 않음.');
			return done(null,false,req.flash('loginMessage','비밀번호가 일치하지 않습니다.'));
		}
		// 정상인 경우
		console.log('계정과 비밀번호가 일치함.');
		console.dir(req.body);
		let username = req.body.username;
		let birthday = req.body.birthday;
		let email = req.body.email;
		let sex = req.body.sex;
		console.log('sex: '+sex);
		UserModel.update({userID:userID},
				{$set:{
					username:username,
					birthday:birthday,
					email:email,
					sex:sex
				}},function(err){
					if(err) {
						done(err,null);
					}
					console.log('회원정보 수정됨');
				});
		
		return done(null,results);
	});
}));





passport.use('local-signup',new LocalStrategy({
	usernameField: 'userID',
	passwordField: 'password',
	passReqToCallback: true,
},function(req,userID,password,username,birthday,email,sex,done){
	// 요청 파라미터 중 userID파라미터 확인
	let paramID = req.body.userID || req.query.userID;
	console.log('passport의 local-signup 호출됨: '+ userID + ', '+password+', ' +paramID);
	
	process.nextTick(function(){
		UserModel.findById({'userID':userID},function(err,user){
			if(err) {
				return done(err);
			}
			if(user) {
				console.log('기존에 계정이 있음');
				return done(null,false,req.flash('signupMessage','계정이 이미 있습니다.'));
			} else {
				// model 인스턴스 객체 만들어 저장
				let user = new UserModel({
					'userID':userID,
					'password':password,
					'username':username,
					'birthday':birthday,
					'email':email,
					'sex':sex,
				});
				user.save(function(err){
					if(err) {
						throw err;
					}
					console.log('사용자 데이터 추가함');
					return done(null,user);
				});
			}
		});
	});
}));

// 사용자 인증에 성공했을 때
passport.serializeUser(function(user,done){
	console.log('serializeUser() called');
	console.dir(user);
	
	done(null,user);
});

// 사용자 인증 이후 사용자 요청이 있을 때마다 호출
passport.deserializeUser(function(user,done){
	console.log('deserializeUser() called');
	console.dir(user);
	
	done(null,user);
});

const init = function(db,schema,model,app) {
	console.log('users의 init 호출됨');
	database = db;
	UserSchema = schema;
	UserModel = model;
	console.dir(app.get('database'));
	passport.use('facebook',facebook(app,passport));
	passport.use('kakaotalk',kakaotalk(app,passport));
}

const login = function(req,res,callback) {
	console.log('user 모듈 안에 있는 login 호출됨.');
	let userID = req.body.username1;
	let password = req.body.password;
	console.log(userID);
	console.log(password);
	
	UserModel.findById(userID,function(err,results){
		if(err) {
			callback(err,null);
			return;
		}
		console.log('아이디 [%s]로 사용자 검색 결과',userID);
		//console.dir(results);
		if(results.length>0){
			console.log('아이디와 일치하는 사용자 찾음');
			let user = new UserModel({'userID':userID});
			console.log('aaaa');
			console.log(results[0]._doc.salt);
			let authenticated = user.authenticate(password,results[0]._doc.salt,results[0]._doc.hashed_password);
			if(authenticated) {
				console.log('비밀번호 일치함');
				callback(null,results);
			} else {
				console.log('비밀번호 일치하지 않음');
				callback(null,null);
			}
			
		} else {
			console.log('아이디와 일치하는 사용자를 찾지 못함');
			callback(null,null);
		}
	});
}
const adduser = function(req,res,callback) {
	console.log('user 모듈 안에 있는 adduser 호출됨');
	let userID = req.body.userID;
	let password = req.body.pw;
	let username = req.body.username;		//body parsing
	let birthday = req.body.birthday;
	let email = req.body.email;
	let sex = req.body.sex;
	console.log('userID:' + userID);
	console.log('password:' + password);
	console.log('username:' + username);
	console.log('birthday:' + birthday);
	console.log('email:' + email);
	console.log('sex:'+ sex);
	let model = new UserModel({
		"userID":userID,
		"password":password,
		"username":username,
		"birthday":birthday,
		"email":email,
		"sex":sex,
	});
	model.save(function(err){
		if(err) {
			callback(err,null);
			return;
		}
		console.log("사용자 데이터 추가함");
		callback(null,model);
	});
	
	
}
const confirm = function(req,res,callback) {
	console.log('user 모듈 안에 있는 confirm 호출됨');
	let userID = req.query.id;
	
	
	console.log('userID = '+userID);
	UserModel.find({"userID":userID},function(err,results){
		if(err) {
			console.error(err);
			callback(err,null);
		} 
		if(results.length>0) { //아이디 중복
			console.log("아이디 중복");
			callback(null,results);
		} else{
			console.log("중복아님");
			callback(null,null);
		}
	});
	
}
const findByUserID = function(req,res,callback){
	console.log('user 모듈 안에 있는 confirm 호출됨');
	let uid = req.query.id || req.body.id;
	UserModel.findOne({"userID":uid},function(err,result){
		if(err){
			callback(err,null);
			return;
		}
		if(!result || result.length>0) {
			console.log('결과 없음');
			callback(null,null);
			return;
		}
		console.log('결과 있음');
		callback(null,result);
	});
}

const findMyAccount = function(req,res,myID,callback){
	console.log('user 모듈 안에 있는 findMyAccount 호출됨');
	UserModel.findOne({"userID":myID},function(err,result){
		if(err){
			callback(err,null);
			return;
		}
		if(!result || result.length>0) {
			console.log('결과 없음');
			callback(null,null);
			return;
		}
		console.log('결과 있음');
		callback(null,result);
	});
}

const listuser = function(req,res) {
	console.log('user 모듈 안에 있는 listuser 호출됨.');
}

module.exports.passport = passport;
module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
module.exports.confirm = confirm;
module.exports.findByUserID = findByUserID;
module.exports.findMyAccount = findMyAccount;
module.exports.UserSchema = UserSchema; 
module.exports.UserModel = UserModel; 