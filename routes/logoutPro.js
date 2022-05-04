var express = require('express');
var route = express.Router();

route.get('/', (req,res) => {
	req.logout();
	console.log('세션을 삭제하고 로그아웃 되었습니다.');
	res.redirect('/logoutPage');
});

route.post('/',(req,res)=>{
	console.log('render: index.ejs');
    res.render('index',{req:req});
});

module.exports = route;