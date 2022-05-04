var express = require('express');
var user = require('./user');
var route = express.Router();

route.get('/', (req,res) => {
	console.log('render: loginfailed.ejs');
    res.render('loginfailed');
});

route.post('/',(req,res)=>{
	console.log('render: loginfailed.ejs');
    res.render('loginfailed');
});

module.exports = route;