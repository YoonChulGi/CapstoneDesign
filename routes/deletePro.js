var express = require('express');
var route = express.Router();
var fs = require('fs');
var article = require('./article');

route.get('/', (req,res) => {
	console.log('/deletePro ... get');
	let _id = req.query.id;
	article.findById(req,res,function(err,result){
		if(err){
			console.error(err);
			return;
		}
		if(!result){
			console.error("not found");
			return;
		} else{
			let picture = result._doc.picture;
			console.log(picture);
			let category = result._doc.category;
			console.log(category);
			console.dir(fs);
			fs.unlink('uploads/'+picture,function(err){
				if(err){
					console.error(err);
					return;
				}
				console.log('삭제하려는 게시글의 이미지 파일이 삭제되었습니다.');
				article.deleteOne(req,res,function(err){
					if(err){
						console.error(err);
						return;
					}
					
					res.redirect('/category?c='+category+'&d=ok');	
				});
				
			});
			
		}
		
	});
	
});


module.exports = route;