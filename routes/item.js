var express = require('express');
var route = express.Router();
var article = require('./article');
route.get('/', (req,res) => {
	console.log('get..... item');
	console.log('render: item.ejs');
	let user = req.user;
	if(user == undefined) {
		res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
		res.write('<script>alert("로그인 후 이용할 수 있는 컨텐츠 입니다.");window.location.href="/login"</script>');
		res.end();
		return;
	} else {
		article.findandmodify(req,res,function(err,result){
			console.log('findandmodify');
			if(err) {
				console.error(err);
				return;
			} 
			console.dir(result);
			res.render('item',{result:result,req:req});	
		});
	}
	
    
});

route.post('/',(req,res)=>{
	console.log('post..... item');
	console.log('render: item.ejs');
    res.render('item');
});

module.exports = route;