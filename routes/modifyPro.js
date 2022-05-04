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
	console.log('/modifyPro ... post');
	console.log('body');
	console.dir(req.body);
	let category1 = req.body.category1;
	let category2 = req.body.category2;
	let title = req.body.title;
	let price = req.body.price;
	let discribe = req.body.discribe;
	let flag = req.body.pictureflag;
	
	console.log(category1);
	console.log(category2);
	console.log(title);
	console.log(price);
	console.log(discribe);
	console.log(flag);

	article.findById(req,res,function(err,rawData){
		if(err){
			console.error(err);
			return;
		}
		if(rawData){
			console.log("rawData");
			console.log(rawData._doc.category);
			console.log(rawData._doc.title);
			console.log(rawData._doc.picture);
			console.log(rawData._doc.price);
			console.log(rawData._doc.discribe);
			if(flag=="true"){
				console.dir('flag====>>true');
				fs.unlink('uploads/'+rawData._doc.picture,function(err){
					if(err){
						console.error(err);
						return;
					}
					console.log('수정 전 이미지 파일이 삭제되었습니다.');
					// new file upload
					
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
						rawData.category = category2;
						rawData.title = title;
						rawData.price = price;
						rawData.discribe = discribe;
						rawData.picture = filename;
						rawData.save(function(err,modifiedData){
							if(err){
								console.error(err);
								return;
							}
							console.log('게시글이 수정되었습니다,flag='+flag);
							console.dir(modifiedData);
							res.redirect('/item?id='+rawData._doc._id);
						});
				
					}
					catch (ex){
						console.error(ex);
					}
				});
			} else{
				rawData.category = category2;
				rawData.title = title;
				rawData.price = price;
				rawData.discribe = discribe;
				rawData.save(function(err,modifiedData){
					if(err){
						console.error(err);
						return;
					}
					console.log('게시글이 수정되었습니다, flag ='+flag);
					console.dir(modifiedData);
					res.redirect('/item?id='+rawData._doc._id);
				});
			}
		}
	});
});

module.exports = route;