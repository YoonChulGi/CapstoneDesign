var express = require('express');
var route = express.Router();
var user = require('./user');
var article = require('./article');
route.get('/', (req,res) => {
	console.log('buyList...get');
	let userID = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,userID,function(err,userInfo){
		if(err){
			console.error(err);
			return;
		}
		if(!userInfo){
			console.error('결과없음');
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("구매중인 재능이 없습니다.");window.location.href="/mypage"</script>');
			res.end();
			return;
		} else{
			let buying_id = userInfo._doc.buying_id;
			if(buying_id==""){
				console.error('결과없음');
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<script>alert("구매중인 재능이 없습니다.");location.href="/mypage";</script>');
				res.end();
				return;
			} else{
				article.findBasket(req,res,buying_id,function(err,results){
					if(err){
						console.error(err);
						return;
					}
					if(!results){
						console.error('결과없음');
						res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
						res.write('<script>alert("구매중인 재능이 없습니다.");location.href="/mypage";</script>');
						res.end();
						return;
					} else {
						console.log('결과 있음');
						res.render('buyList',{req:req,userInfo:userInfo,articleInfo:results});
					}
				});
			}
			
		}
	});
});
module.exports = route;