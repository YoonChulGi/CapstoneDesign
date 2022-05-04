var express = require('express');
var user = require('./user');
var route = express.Router();

route.get('/', (req,res) => {
	res.render('logoutPage',{req:req});
});

route.post('/',(req,res)=>{
    
});

module.exports = route;