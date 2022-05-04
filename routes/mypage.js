var express = require('express');
var user = require('./user');
var route = express.Router();

route.get('/', (req,res) => {
	console.log('render: mypage.ejs');
	let myID = req.user.userID || req.user[0].userID;
	console.log(myID);
	user.findMyAccount(req,res,myID,function(err,result){
		if(err) {
			console.error(err);
			res.render('mypage',{req:req});
		}else if(result){
			res.render('mypage',{req:req,result:result});		
		}else{
			res.render('mypage',{req:req,result:result});
		}
	});
});

route.post('/',(req,res)=>{
	console.log('render: mypage.ejs');
	res.render('mypage',{req:req});
});

module.exports = route;