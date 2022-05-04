var express = require('express');
var route = express.Router();
var article = require('./article');
route.get('/', (req,res) => {
	console.log('render: myArticles.ejs');
	let userID = req.user.userID || req.user[0].userID;
    console.log(userID);
    article.findByAuthor_id(userID,req,res,function(err,result){
    	if(err){
    		console.error(err);
    		return;
    	}
    	if(!result){
    		console.log('게시글 없음');
    		res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    		res.write('<script>alert("등록한 게시물이 없습니다.");location.href="/mypage";</script>');
    		res.end();
    		return;
    	}
    	console.dir(result);
    	res.render('myArticles',{result:result,req:req,res:res});	
    });
    
    
	
});

route.post('/',(req,res)=>{
	console.log('render: myArticles.ejs');
    res.render('myArticles');
});

module.exports = route;