var express = require('express');
var route = express.Router();
route.get('/', (req,res) => {
	console.log('charge...get');
	console.log('render: charge.ejs');
    res.render('charge',{req:req});
});

module.exports = route;