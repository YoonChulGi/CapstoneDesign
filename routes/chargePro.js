var express = require('express');
var user = require('./user');
var route = express.Router();

route.post('/', (req,res) => {
	console.log('chargePro...post');
	let money = parseInt(req.body.money);
	console.log('money == ' + typeof money);
	let userID = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,userID,function(err,result){
		if(err){
			console.error(err);
			res.redirect('/mypage');
			return;
		}
		if(result){
			let beforeMoney = result._doc.money;
			console.log('beforeMoney == '+typeof beforeMoney);
			
			result.money+=money;
			result.save(function(err,afterResult){
				if(err){
					console.error(err);
					res.redirect('/mypage');
					return;
				}
				console.log('돈 충전 완료 before:' + beforeMoney + ' after: '+ afterResult._doc.money);
				res.redirect('/mypage');
			});
		}
	});
    
});


module.exports = route;