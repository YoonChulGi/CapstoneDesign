var express = require('express');
var route = express.Router();
var user = require('./user');
route.get('/', (req,res) => {
	console.log('render: write.ejs');
	console.log(req.query.category);
    res.render('write',{req:req});
});

route.post('/',(req,res)=>{
	console.log('render: write.ejs');
	res.render('write',{req:req});
});

module.exports = route;