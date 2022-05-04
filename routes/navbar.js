var express = require('express');
var route = express.Router();
var user = require('./user');
route.get('/', (req,res) => {
	console.log(req.query.c);
	console.log('render: navbar.ejs');
    res.render('navbar',{req:req});
});

route.post('/',(req,res)=>{
	console.log('category post called');
	res.end();
});

module.exports = route;