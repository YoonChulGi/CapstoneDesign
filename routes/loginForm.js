var express = require('express');
var route = express.Router();

route.get('/', (req,res) => {
	console.log('render: loginForm.ejs');
    res.render('loginForm',{prop:"login"});
});
module.exports = route;