var express = require('express');
var user = require('./user');
var route = express.Router();

route.get('/', (req,res) => {
	console.log('render: confirmId.ejs');
	console.log('param: '+ req.query.id);
	let flag = false;
	user.confirm(req,res,function(err,results){
		
		if(err){
			console.error(err);
			res.end();
		}
		if(results) { // 중복 
			res.render('confirmId',{flag:flag,id:req.query.id});
		}else {
			console.log("else");
			flag = true;
			res.render('confirmId',{flag:flag,id:req.query.id});
		}
	});
		
    
});

module.exports = route;