var user = require('./user');

let database;
let mongoose;
let ArticleSchema;
let ArticleModel;


let UserSchema;
let UserModel;

const init = function(db,schema,model,userschema,usermodel,app,mongoose1) {
	console.log('article의 init 호출됨');
	database = db;
	ArticleSchema = schema;
	ArticleModel = model;
	UserSchema = userschema;
	UserModel = usermodel;
	mongoose = mongoose1;
	//console.dir(ArticleModel);
}

const findCategory = function(category,req,res,callback) {
	console.log('article 모듈 안에 있는 findCategory 호출됨.');
	ArticleModel.findCategory(category,function(err,results){
		if(err) {
			callback(err,null);
			return;
		}
		if(results.length>0) {
			console.log(results.length+'개 있음');
			callback(null,results);
		} else {
			console.log('없음');
			callback(null,null);
		}
	});
}

const findById = function(req,res,callback) {
	console.log('article 모듈 안에 있는 findById 호출됨.');
	console.log(req.query.id);
	ArticleModel.findOne({_id:req.query.id},function(err,results){
		console.dir(results);
		if(err) {
			callback(err,null);
			return;
		}
		if(results._doc){
			console.log('있음');
			callback(null,results);
		}
		else {
			console.log('없음');
			callback(null,null);
		}
	});
}
const deleteOne = function(req,res,callback){
	console.log('article 모듈 안에 있는 deleteOne 호출됨.');
	console.log(req.query.id);
	ArticleModel.deleteOne({_id:req.query.id},function(err){
		if(err){
			callback(err);
			return;
		}
		callback(null);
	});
}

const findByAuthor_id = function(author_id,req,res,callback){
	console.log('article 모듈 안에 있는 findByAuthor_id 호출됨.');
	ArticleModel.findAuthor_id(author_id,function(err,results){
		if(err) {
			callback(err,null);
			return;
		}
		if(results.length>0) {
			console.log(results.length+'개 있음');
			callback(null,results);
		} else {
			console.log('없음');
			callback(null,null);
		}
	});
}

const searchArticle = function(title,req,res,callback) {
	console.log('article 모듈 안에 있는 searchArticle 호출됨.');
	let searchReg = new RegExp(title);
	ArticleModel.find({"title":{$regex:searchReg}},function(err,results){
		if(err) {
			console.error("에러발생..searchArticle");
			callback(err,null);
			return;
		}
		if(results.length==0){
			console.log("결과 없음");
			callback(null,null);
			return;
		}
		console.log('결과 '+results.length+'개 있음');
		callback(null,results);
	});
}

const addarticle = function(req,res,filename,callback) {
	console.log('article 모듈 안에 있는 addarticle 호출됨');
	let title = req.body.title;
	let category = req.body.category2;
	let author = '';
	if(req.user) {
		if(req.user.provider == 'facebook') {
			author = req.user.facebook.last_name + req.user.facebook.first_name;
		} else if(req.user.provider == 'kakao') {
			author = req.user.username;
		} else {
			author = req.user[0].username;
		}
	}
	let user_id = req.user.userID || req.user[0].userID;
	let discribe = req.body.discribe;
	let price = req.body.price;
	let picture = filename;
	console.log('title:' + title);
	console.log('category:' + category);
	console.log('author:' + author);
	console.log('discribe:' + discribe);
	console.log('price:' + price);
	console.log('picture:' + picture);
	
	let model = new ArticleModel({
		"title":title,
		"category":category,
		"author":author,
		"author_id": user_id,
		"discribe":discribe,
		"price":req.body.price,
		"picture":picture,
	});
	model.save(function(err){
		if(err) {
			callback(err,null);
			return;
		}
		console.log("article 데이터 추가함");
		callback(null,model);
	});
}

const deletearticle = function(req,res,filename,callback){
	console.log('article 모듈 안에 있는 deletearticle 호출됨');
	
}

const findandmodify = function(req,res,callback) {
	console.log('article 모듈 안에 있는 findandmodify 호출됨');
	let id = req.query.id;
	console.log(id);
	ArticleModel.findOne({_id:id},function(err,rawContent){
		if(err){
			callback(err,null);
			console.error(err);
			return;
		}
		rawContent.count+=1;
		rawContent.save(function(err){
			if(err) {
				callback(err,rawContent);
				console.error(err);
				return;
			}
			callback(null,rawContent);
		});
	});
}

const modifyArticle1 = function(title,category,discribe,picture,callback){
	console.log('article 모듈 안에 있는 modifyArticle 호출됨');
	console.log(title);
	console.log(category);
	console.log(discribe);
	console.log(picture);
	
	ArticleModel.findOne({_id:id},function(err,rawContent){
		if(err){
			callback(err,null);
			console.error(err);
			return;
		}
		rawContent.count+=1;
		rawContent.save(function(err){
			if(err) {
				callback(err,rawContent);
				console.error(err);
				return;
			}
			callback(null,rawContent);
		});
	});
}

const findandDelte = function(req,res,callback) {
	console.log('article 모듈 안에 있는 findandmodify 호출됨');
	let id = req.query.id;
	console.log(id);
	ArticleModel.findOne({_id:id},function(err,rawContent){
		if(err){
			callback(err,null);
			return;
		}
		rawContent.count+=1;
		rawContent.save(function(err){
			if(err) {
				callback(err,rawContent);
				console.error(err);
				return;
			}
			callback(null,rawContent);
		});
	});
}

const findBasket = function(req,res,id,callback) {
	console.log('article 모듈 안에 있는 findBasket 호출됨');
	
	console.log('id= '+id);
	let basket_id_tmp = id.split('#');
	let basket_id = new Array();
	
	
	for(let i=0;i<basket_id_tmp.length-1;i++) {
		basket_id[i] = mongoose.Types.ObjectId(basket_id_tmp[i]);
		console.log('basket_id['+i+']= '+basket_id[i]);
	}
	
	let i=0;
	do{
		basket_id[i] = mongoose.Types.ObjectId(basket_id_tmp[i]);
		console.log('basket_id['+i+']= '+basket_id[i]);
		i++;
	}while(i<basket_id_tmp.length-1);
	
	console.log('반복완료');
	ArticleModel.find({"_id":{$in:basket_id}},function(err,result){
		if(err){
			callback(err,null);
			console.error(err);
			return;
		}
		if(!result || result.length == 0) {
			console.log('결과 없음');
			console.log('result.length = ' +result.length);
			callback(null,null);
			return;
		} else {
			console.log('결과 있음');
			callback(null,result);	
		}
		
	});
}

const addBasket = function(req,res,callback) {
	console.log('article 모듈 안에 있는 addBasket 호출됨');
	let userID = '';
	if(req.user[0]) { // 일반로그인
		console.log('일반로그인');
		userID = req.user[0].userID;
	} else if(req.user) {
		if(req.user.provider=='facebook' || req.user.provider == 'kakao') {
			console.log('페북또는 카카오 로그인');
			userID = req.user.userID;
		}
	}
	
	
	UserModel.findOne({userID:userID},function (err,result){
		if(err) {
			callback(err,null);
			console.error(err);
			return;
		}
		result.basket += (req.query.article_id + '#');
		result.save(function(err){
			if(err) {
				callback(err,result);
				console.error(err);
				return;
			}
			callback(null,result);
		});
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


module.exports.init = init;
module.exports.ArticleSchema = ArticleSchema; 
module.exports.findCategory = findCategory; 
module.exports.addarticle = addarticle;
module.exports.addBasket = addBasket;
module.exports.findandmodify = findandmodify;
module.exports.findBasket = findBasket;
module.exports.searchArticle = searchArticle;
module.exports.findByAuthor_id = findByAuthor_id;
module.exports.findById = findById;
module.exports.deleteOne = deleteOne;
module.exports.modifyArticle1 = modifyArticle1;
