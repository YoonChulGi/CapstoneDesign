var express = require('express');
var route = express.Router();
var user = require('./user');

route.get('/', (req,res) => {
	console.log('chatBox...get');
	let article_id = req.query.id; // 어찌됬든 게시글 아이디
	let userID = req.user.userID || req.user[0].userID; // 어찌됬든 내아이디
	let author_id = req.query.author_id || req.query.buyer_id; // 구매자의 경우 앞의것 판매자의경우 뒤의것으로 들어감
	let prop = req.query.prop;
//	let myImg = '';
//	user.findMyArticle(req,res,userID,function(err,result){
//		if(err){
//			console.error('error');
//			return;
//		} 
//		if(result){
//			myImg = result._doc.
//		}
//	});
	
	
	console.log('article id: '+article_id);
	console.log('userID: '+userID);
	console.log('author_id: '+ author_id);
	console.log('prop: ' + prop)
	console.log('render: chatBox.ejs');
    res.render('chatBox',{req:req,article_id:article_id,author_id:author_id,prop:prop});
});

route.post('/',(req,res)=>{
	console.log('chatBox...post');
	res.end();
});

module.exports = route;