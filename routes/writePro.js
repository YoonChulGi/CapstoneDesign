var express = require('express');
var route = express.Router();
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var article = require('./article');
var storage = multer.diskStorage({
	destination: function(req,file,callback) {
		callback(null,'uploads');
	},
	filename: function(req,file,callback) {
		callback(null,Date.now()+file.originalname);
	}
});

var upload = multer({
	storage: storage,
	limits:{
		files:1,
		fileSize:1024*1024*1024
	}
});
route.get('/', (req,res) => {
	console.log('/writePro ... get');
	console.dir(req.query);
	res.end();
});

route.route('/').post(upload.array('attach_file',1),function(req,res){
	console.log('/writePro ... post');
	
	let category1 = req.body.category1;
	let category2 = req.body.category2;
	let title = req.body.title;
	let price = req.body.price;
	let discribe = req.body.discribe;
	
	console.log(category1);
	console.log(category2);
	console.log(title);
	console.log(price);
	console.log(discribe);
	
	try {
		var files = req.files;
		console.dir('#====업로드된 첫번째 파일 정보 ====#');
		console.dir(req.files[0]);
		console.dir('#====#');
		var originalname='',
			filename ='',
			mimetype='',
			size=0;
		if(Array.isArray(files)){ // 배열에 들어가 있는 경우 
			console.log('배열에 있는 파일 갯수: %d',files.length);
			
			for(let index=0;index<files.length;index++){
				originalname=files[index].originalname;
				filename = files[index].filename;
				mimetype = files[index].mimetype;
				size = files[index].size;
			}
		}else { // 배열에 들어가 있지 않은 경우
			console.log('파일 갯수: 1');
			originalname=files[index].originalname;
			filename = files[index].filename;
			mimetype = files[index].mimetype;
			size = files[index].size;
		}
		
		console.log('현재 파일 정보: ' + originalname +',' + filename +',' + mimetype +',' + size);
		
		article.addarticle(req,res,filename,function(err,model){
			if(err) {
				console.error('글쓰기 실패');
				return;
			}
			console.log('글쓰기 성공');
			
			res.redirect('/category?c='+category2);
		});

	}
	catch (ex){
		console.error(ex);
	}
});

module.exports = route;