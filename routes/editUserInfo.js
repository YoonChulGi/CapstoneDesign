var express = require('express');
var route = express.Router();
var user = require('./user');
route.get('/', (req,res) => {
	console.log('render: editUserInfo.ejs');
    res.render('editUserInfo',{req:req});
});

route.post('/',(req,res)=>{
	console.log('render: editUserInfo.ejs');
    res.render('editUserInfo',{req:req});
});

module.exports = route;