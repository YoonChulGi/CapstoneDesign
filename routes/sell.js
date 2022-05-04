var express = require('express');
var user = require('./user');

var route = express.Router();
route.get('/', (req,res) => {
	console.log('render: sell.ejs');
	let id = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,id,function(err,result){
		if(err){
			console.error(err);
			return;
		}
		if(!result){
			console.log('결과가 없다');
			return;
		}
		let talent = result._doc.talent;
		console.log('talent = ' +talent);
		if(!talent || talent=="") {
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("판매자로 등록되어 있지 않은 사용자입니다.");</script>');
			res.write('<script>window.location.href="/registSeller";</script>');
			res.end();
		} else{
			res.render('sell',{req:req});	
		}
	});
});

route.post('/',(req,res)=>{
	console.log('render: sell.ejs');
    res.render('sell',{req:req});
});

module.exports = route;