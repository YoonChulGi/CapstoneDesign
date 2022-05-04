var express = require('express');
var route = express.Router();
var user = require('./user');
route.get('/', (req,res) => {
	console.log('render: complete.ejs');
    res.render('complete');
});

route.post('/',(req,res)=>{
	user.adduser(req,res,function(err,model){
		if(err) {
			console.error(err);
			return;
		} 
		res.redirect('complete');
	});
});

module.exports = route;