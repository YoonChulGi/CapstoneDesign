var express = require('express');
var route = express.Router();
var user = require('./user');
var article = require('./article');
route.get('/', (req,res) => {
	console.log('portfolio...get');
	console.log('render: portfolio.ejs');
	console.log(req.query.id);
	user.findByUserID(req,res,function(err,authorInfo){
		if(err){
			console.error(err);
			res.redirect('/index');
		}
		if(authorInfo){
			article.findByAuthor_id(req.query.id,req,res,function(err,articles){
				if(err){
					console.error(err);
					return;
				}
				res.render('portfolio',{authorInfo:authorInfo,articles:articles});
			});
			
		} else{
			console.log('결과 없음');
			res.redirect('/index');
		} 
	});
    
});

route.post('/',(req,res)=>{
	console.log('portfolio...post');
	console.log('render: portfolio.ejs');
    res.render('portfolio');
});

module.exports = route;