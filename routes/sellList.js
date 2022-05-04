var express = require('express');
var route = express.Router();
var user = require('./user');
var article = require('./article');
route.get('/', (req,res) => {
	console.log('sellList...get');
	let MyID = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,MyID,function(err,userInfo){
		if(err){
			console.error('error');
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("error");window.location.href="/mypage"</script>');
			return;
		}
		if(!userInfo){
			console.error('내 아이디 정보 없음');
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("내 아이디 정보 없음");window.location.href="/mypage"</script>');
		} else {
			console.log('내 아이디 정보 찾음');
			let sell_tmp = userInfo._doc.selling_id.split('#');
			let sell = new Array();
			for(let i=0;i<sell_tmp.length-1;i++){
				sell[i] = sell_tmp[i];
				console.log('sell['+i+'] = '+sell[i]);
			}
			let _sell = new Array();
			let x = 0;
			for(let i=0;i<sell.length;i++){
				_sell[x++] = sell[i].split('_')[0]; //article_id
				_sell[x++] = sell[i].split('_')[1]; //buyer's id
			}
			console.log('_sell');
			 console.dir(_sell);
			let article_id_string ="";
			let buyersID = "";
			for(let i=0;i<_sell.length;i++){
				if(i%2==0){
					article_id_string += _sell[i];
					article_id_string += '#';
				} else {
					buyersID += _sell[i];
					buyersID+= '#';
				}
			}
			console.log(article_id_string);
			if(article_id_string==""){
				console.error('판매중인 재능이 없습니다.');
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<script>alert("판매중인 재능이 없습니다.");location.href="/mypage";</script>');
				res.end();
			} else{
				article.findBasket(req,res,article_id_string,function(err,results){
					if(err){
						console.error(err);
						return;
					}
					if(!results){
						console.error('결과없음');
						res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
						res.write('<script>alert("error");history.go(-1);</script>');
						res.end();
					} else {
						console.log('결과 있음');
						res.render('sellList',{req:req,userInfo:userInfo,articleInfo:results,buyersID:buyersID});
					}
				});
			}
		} // else 
	});
});
module.exports = route;