var express = require('express');
var route = express.Router();
var user = require('./user');
route.get('/', (req,res) => {
	console.log('editUserInfoSuccess ... get');
	req.success = 'ok';
	let userID = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,userID,function(err,result){
		if(err){
			console.error(err);
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("알 수 없는 에러 발생");location.href="/mypage";</script>');
			res.end();
		} 
		if(!result){
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("결과 없음");location.href="/mypage";</script>');
			res.end();
		} else {
			res.render('mypage',{req:req,result:result});		
		}
	})
    
});

route.post('/',(req,res)=>{
	console.log('editUserInfoSuccess ... post');
	//console.log('render: editUserInfo.ejs');
    //res.render('editUserInfo',{req:req});
});

module.exports = route;