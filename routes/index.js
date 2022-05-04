var express = require('express');
var user = require('./user');
var route = express.Router();

route.get('/', (req,res) => {
	console.log('render: index.ejs');
	res.render('index',{req:req});	
});

route.post('/',(req,res)=>{
	console.log('index .. post');

});

module.exports = route;