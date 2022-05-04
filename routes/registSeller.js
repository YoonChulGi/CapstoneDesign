var express = require('express');
var route = express.Router();
route.get('/', (req,res) => {
	console.log('render: registSeller.ejs');
    res.render('registSeller',{req:req});
});

module.exports = route;