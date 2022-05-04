var express = require('express');
var route = express.Router();
var user = require('./user');
var article = require('./article');
route.get('/', (req,res) => {
	console.log('searchPro...get');
	console.log('searchString: '+req.query.searchString);
	article.searchArticle(req.query.searchString,req,res,function(err,results){
		if(err) {
			console.error(err);
			return;
		}
		if(!results) {
			console.log('결과 없음');
			res.render('search',{result:results,req:req,res:res});
			return;
		}
		console.log('결과 있음');
		console.dir(results);
		res.render('search',{result:results,req:req,res:res});
	});
});

route.post('/',(req,res)=>{
	console.log('searchPro...post');
	console.log('searchString: '+req.param.searchString);
});

module.exports = route;