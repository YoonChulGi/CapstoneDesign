var express = require('express');
var route = express.Router();
var user = require('./user');
var article = require('./article');


route.get('/', (req,res) => {
	console.log('basket...get');
	console.log('render: basket.ejs');
	
	let myID = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,myID,function(err,result){
		if(err){
			console.error(err);
			return;
		}
		if(result){
			let baskets = result._doc.basket;
			if(baskets==""){
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<script>alert("장바구니가 비어있습니다.");window.location.href="/mypage"</script>');
				res.end();
				return;
			}
			article.findBasket(req,res,baskets,function(err,result_Basket){
				if(err) {
					console.error(err);
					return;
				} 
				if(result_Basket.length>0) {
					res.render('basket',{result:result_Basket});
				}
			});
		} else{
			console.error('장바구니 오류');
			res.redirect('/mypage');
		}
	});
});

route.post('/',(req,res)=>{
	console.log('basket...post');
	console.log('render: basket.ejs');
	res.render('basket');
});

module.exports = route;