var express = require('express');
var route = express.Router();
var article = require('./article');
route.get('/', (req,res) => {
	console.log('addBasket..... get');
	console.log('article_id: '+ req.query.article_id);
	article.addBasket(req,res,function(err){
		if(err) throw err;
		res.redirect('item?id='+req.query.article_id+'&add=ok');
	});
	
});

route.post('/',(req,res)=>{
	console.log('addBasket..... post');
	res.end();
});

module.exports = route;