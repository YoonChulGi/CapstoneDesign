var express = require('express');
var route = express.Router();
var article = require('./article');
route.get('/', (req,res) => {
	console.log(req.query.id);
	
	article.findById(req,res,function(err,result){
		if(err){
			console.error(err);
			return;
		}
		if(result){
			console.log('render: modify.ejs');
			res.render('modify',{req:req,result:result});		
		}
	});
	
	
    
});

route.post('/',(req,res)=>{
	console.log('render: modify.ejs');
	res.render('write',{req:req});
});

module.exports = route;