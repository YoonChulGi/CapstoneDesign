const express = require('express')
	, http = require('http')
	, static = require('serve-static')
	, path = require('path')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, config = require('./config')
	, database = require('./database/database')
	, mongoose = require('mongoose')
	, expressSession = require('express-session')
	, passport = require('passport')
	, flash = require('connect-flash')
	, socketio = require('socket.io');
	;


var app = express();
app.set('port',process.env.PORT || config.server_port);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));
app.use(static(path.join(__dirname,'public')));
app.use(static(path.join(__dirname,'uploads')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var cors = require('cors');
app.use(cors());

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/loginForm');
var registerRouter = require('./routes/registerForm');
var completeRouter = require('./routes/complete');
var confirmIdRouter = require('./routes/confirmId');
var loginProRouter = require('./routes/loginPro');
var loginfailedRouter = require('./routes/loginfailed');
var logoutProRouter = require('./routes/logoutPro');
var logoutPageRouter = require('./routes/logoutPage');
var categoryRouter = require('./routes/category');
var sellRouter = require('./routes/sell');
var writeRouter = require('./routes/write');
var writeProRouter = require('./routes/writePro');
var itemRouter = require('./routes/item');
var mypageRouter = require('./routes/mypage');
var editUserInfoRouter = require('./routes/editUserInfo');
var editUserInfoPro = require('./routes/editUserInfoPro');
var editUserInfoSuccess = require('./routes/editUserInfoSuccess');
var addBasketRouter = require('./routes/addBasket');
var basketRouter = require('./routes/basket');
var searchPro = require('./routes/searchPro');
var myArticlesRouter = require('./routes/myArticles');
var deleteProRouter = require('./routes/deletePro');
var navbarRouter = require('./routes/navbar');
var nonameRouter = require('./routes/noname');
var modifyRouter = require('./routes/modify');
var modifyPro = require('./routes/modifyPro');
var portfolioRouter = require('./routes/portfolio');
var registSellerRouter = require('./routes/registSeller');
var registSellerPro = require('./routes/registSellerPro');
var buyRouter = require('./routes/buy');
var chargeRouter = require('./routes/charge');
var chargePro = require('./routes/chargePro');
var buyListRouter = require('./routes/buyList');
var sellListRouter = require('./routes/sellList');
var chatBoxRouter = require('./routes/chatBox');

var fbRouter = require('./routes/fbrouter');
var kakaotalkRouter = require('./routes/kakaorouter');

app.use('/index', indexRouter);
app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/complete',completeRouter);
app.use('/confirmId',confirmIdRouter);
app.use('/loginPro',loginProRouter);
app.use('/loginfailed',loginfailedRouter);
app.use('/logoutPro',logoutProRouter);
app.use('/logoutPage',logoutPageRouter);
app.use('/category',categoryRouter);
app.use('/auth',fbRouter);
app.use('/oauth',kakaotalkRouter);
app.use('/sell',sellRouter);
app.use('/write',writeRouter);
app.use('/navbar',navbarRouter);
app.use('/noname',nonameRouter);
app.use('/writePro',writeProRouter);
app.use('/item',itemRouter);
app.use('/mypage',mypageRouter);
app.use('/editUserInfo',editUserInfoRouter);
app.use('/editUserInfoPro',editUserInfoPro);
app.use('/editUserInfoSuccess',editUserInfoSuccess);
app.use('/addBasket',addBasketRouter);
app.use('/basket',basketRouter);
app.use('/searchPro',searchPro);
app.use('/myArticles',myArticlesRouter);
app.use('/deletePro',deleteProRouter);
app.use('/modify',modifyRouter);
app.use('/modifyPro',modifyPro);
app.use('/portfolio',portfolioRouter);
app.use('/registSeller',registSellerRouter);
app.use('/registSellerPro',registSellerPro);
app.use('/buy',buyRouter);
app.use('/charge',chargeRouter);
app.use('/chargePro',chargePro);
app.use('/buyList',buyListRouter);
app.use('/sellList',sellListRouter);
app.use('/chatBox',chatBoxRouter);

let server = http.createServer(app).listen(app.get('port'),function() {
	console.log('server start! ??????:' + app.get('port'));
	database.init(app,config);
	createUserSchema();
});

var io = socketio.listen(server);
console.log('socket.io ????????? ???????????? ????????? ???????????????.');
io.sockets.on('connection',function(socket){
	console.log('connection info: ',socket.request.connection._peername);
	// ?????? ????????? ??????????????? Host, Port ?????? ???????????? ?????? 
	socket.remoteAddress = socket.request.connection._peername.address;
	socket.remotePort = socket.request.connection._peername.port;
});
let login_ids = {};
io.sockets.on('connection',function(socket){
	// 'message' ???????????? ????????? ?????? ?????? 
	socket.on('message',function(message){
		console.log('message ???????????? ???????????????.');
		console.dir(message);
		
		if(message.recepient == 'ALL') {
			//?????? ????????? ?????? ????????????????????? message ???????????? ??????
			console.log('?????? ????????? ?????? ????????????????????? message ???????????? ???????????????.');
			io.sockets.emit('message',message);
		} else {
			// ????????? ?????? ???????????? ????????? ??????
			if(login_ids[message.recepient]){
				console.log('if start');
				io.sockets.connected[login_ids[message.recepient]].emit('message',message);
				io.sockets.connected[login_ids[message.sender]].emit('message',message);
				console.log('if end');
				// ?????? ????????? ??????
				sendResponse(socket,'message','200','???????????? ??????????????????.');
			} else {
				console.log('else start');
				console.log('????????????????????? ID??? ?????? ??? ????????????.');
				io.sockets.connected[login_ids[message.sender]].emit('message',message);
				sendResponse(socket,'login','404','???????????? ????????? ID??? ?????? ??? ????????????.');
				console.log('else end');
			}
		}
	});
	
	socket.on('login',function(login){
		console.log('login ???????????? ???????????????.');
		console.dir(login);
		
		// ?????? ??????????????? ID??? ????????? ??????????????? ID??? ?????? ?????? 
		console.log('????????? ????????? ID: ' + socket.id);
		login_ids[login.id] = socket.id;
		console.dir(login_ids);
		console.log('????????? ??????????????? ID ??????: %d',Object.keys(login_ids).length);
		
		// ?????? ????????? ??????
		sendResponse(socket,'login','200','????????? ???????????????.');
	});
	
	socket.on('logout',function(logout){
		console.log('logout ???????????? ???????????????.');
		console.dir(logout);
		delete login_ids[logout];
		
		sendResponse(socket,'logout','200','???????????? ???????????????.');
	});
	function sendResponse(socket, command, code, message) {
		let statusObj = {command:command, code:code, message:message};
		socket.emit('response',statusObj);
	}
});



function createUserSchema() {
	UserSchema = require('./database/user_schema').createSchema(mongoose);
	UserModel = mongoose.model("users",UserSchema);
	
	app.set('UserSchema',UserSchema);
	app.set('UserModel',UserModel);
	
	ArticleSchema = require('./database/article_schema').createSchema(mongoose);
	ArticleModel = mongoose.model("articles",ArticleSchema);
	
	app.set('ArticleSchema',ArticleSchema);
	app.set('ArticleModel',ArticleModel);
	
	require('./routes/user.js').init(app.get('database'),UserSchema,UserModel,app);
	console.log("users ?????????");
	
	require('./routes/article.js').init(app.get('database'),ArticleSchema,ArticleModel,UserSchema,UserModel,app,mongoose);
	console.log("article ?????????");
}