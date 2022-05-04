var express = require('express');
var route = express.Router();
var article = require('./article');
route.get('/', (req,res) => {
	console.log('render: category.ejs');
	let category = '';
	if(req.query.c == 'web' || req.query.c == 'Front-end') {
		console.log('Front-end');
		category = 'Front-end';
	}else if(req.query.c == 'Back-end'){
		console.log('Back-end');
		category = 'Back-end';
	}else if(req.query.c == 'Framework'){
		console.log('Framework');
		category = 'Framework';
	}else if(req.query.c == 'programming' || req.query.c == 'C') {
		console.log('C');
		category = 'C';
	}else if(req.query.c == 'Java'){
		console.log('Java');
		category = 'Java';
	}else if(req.query.c == 'Python'){
		console.log('Python');
		category = 'Python';
	} else if(req.query.c == "logo" || req.query.c == 'Product'){
		console.log('Product');
		category = 'Product';
	} else if(req.query.c == "Company") {
		console.log('Company');
		category = 'Company';
	} else if(req.query.c == "Application") {
		console.log('Application');
		category = 'Application';
	}
	
	article.findCategory(category,req,res,function(err,results){
		if(err) {
			console.log(err);
			return;
		} 
		if(results) {
			console.log('category.js 결과 있음' );
			console.dir(results);
			res.render('category',{req:req,results:results});
		} else{
			console.log('결과 없음');
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("게시글 없음");location.href="/";</script>');
			return;
		}
	});
});

route.post('/',(req,res)=>{
	console.log('category post called');
	res.end();
});

module.exports = route;