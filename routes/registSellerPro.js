var express = require('express');
var route = express.Router();
var user = require('./user');

var multer = require('multer');
var fs = require('fs');
var cors = require('cors');

let filename = '';

var storage = multer.diskStorage({
	destination: function(req,file,callback) {
		callback(null,'uploads/profileImage');
	},
	filename: function(req,file,callback) {
		
		let orgName = file.originalname;
		let ext = orgName.substring(orgName.lastIndexOf('.'),orgName.length);
		let userID = req.user.userID || req.user[0].userID;
		filename = userID +  ext;
		callback(null,filename);
	}
});
var upload = multer({
	storage: storage,
	limits:{
		files:1,
		fileSize:1024*1024*1024
	}
});




route.post('/',upload.array('attach_file',1),function(req,res){
	console.log('registSellerPro');
	console.log('talent1: '+req.body.talent1);
	console.log('talent2: '+req.body.talent2);
	console.log('talent3: '+req.body.talent3);
	console.log('talent4: '+req.body.talent4);
	let pictureflag = req.body.pictureflag;
	console.log('pictureflag: ' + pictureflag);
	
	let talent = req.body.talent1+'#'
		+req.body.talent2+'#'+req.body.talent3+'#'
		+req.body.talent4;
	let userID = req.user.userID || req.user[0].userID;
	console.log(userID);
	
	
	user.findMyAccount(req,res,userID,function(err,result){
		if(err){
			console.error(err);
			return;
		}
		if(result){
			result.talent = talent;
			result.profimg = filename;
			result.save(function(err,result_talent){
				if(err){
					console.error(err);
					return;
				}
				console.log('talent 정보를 저장하였습니다.');
				console.dir(result_talent);
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<script>alert("판매자 등록이 완료되었습니다.");</script>');
				res.write('<script>window.location.href="/index";</script>');
				res.end();
			});
		}
	});
    
});

module.exports = route;