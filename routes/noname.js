var express = require('express');
var route = express.Router();
var user = require('./user');
route.get('/', (req,res) => {
	console.log('render: noname.ejs');
    res.render('noname',{req:req});
});

route.post('/',(req,res)=>{
	console.log('render: noname.ejs');
    res.render('noname',{req:req});
});

module.exports = route;