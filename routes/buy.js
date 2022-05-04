var express = require('express');
var route = express.Router();
var user = require('./user');
var article = require('./article');
route.get('/', (req,res) => {
	console.log('buy ... get');
	let article_id = req.query.id; 
	let userID = req.user.userID || req.user[0].userID;
	user.findMyAccount(req,res,userID,function(err,result){
		if(err){
			console.error(err);
			return;
		}
		if(!result){
			console.error('결과 없음');
			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<script>alert("error");window.location.href="/"</script>');
			res.end();
		}else{
			article.findById(req,res,function(err,articleInfo){
				if(err){
					console.error(err);
					return;
				}
				if(!articleInfo){
					console.error('결과 없음');
					res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
					res.write('<script>alert("error");window.location.href="/"</script>');
					res.end();
				}else{
					let author_id = articleInfo._doc.author_id;
					console.log('author_id: '+author_id);
					user.findMyAccount(req,res,author_id,function(err,authorInfo){
						if(err){
							console.error(err);
							return;
						}
						if(!authorInfo){
							console.error('결과 없음');
							res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
							res.write('<script>alert("error");window.location.href="/"</script>');
							res.end();
						}else{
							
							let sell_tmp = authorInfo._doc.selling_id.split('#');
							let sell = new Array();
							let flag1 = true;
							for(let i=0;i<sell_tmp.length-1;i++){
								
								if(sell_tmp[i] == article_id+'_'+userID){
									flag1 = false;
								}
							}
							console.log('flag1=' + flag1);
							if(flag1){ 
								console.log('authorInfo.selling_id에 값을 추가합니다.');
								authorInfo.selling_id += article_id+'_'+userID+'#';
								authorInfo.save(function(err){
									if(err){
										console.error(err);
										res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
										res.write('<script>alert("error");window.location.href="/"</script>');
										res.end();
									}
									let flag2 = true;
									let buy_tmp = result._doc.buying_id.split('#');
									let buy = new Array();
									for(let i=0;i<buy_tmp.length-1;i++) {
										if(buy_tmp[i] == article_id){
											flag2 = false;
										}
									}
									console.log('flag2=' + flag2);
									if(flag2){
										
										result.buying_id += article_id + '#';
										result.save(function(err){
											if(err){
												console.error(err);
												res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
												res.write('<script>alert("error");window.location.href="/"</script>');
												res.end();
											}
											
											console.log('render:buy.ejs');
											res.render('buy',{req:req,userInfo:result,authorInfo:authorInfo,articleInfo:articleInfo});
										});
									} else{
										res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
										res.write('<script>alert("이미 구매중인 물품입니다.");history.go(-1)');
									}
								});
							} else {
								let flag2 = true;
								let buy_tmp = result._doc.buying_id.split('#');
								let buy = new Array();
								for(let i=0;i<buy_tmp.length-1;i++) {
									if(buy_tmp[i] == article_id){
										flag2 = false;
									}
								}
								console.log('flag2=' + flag2);
								if(flag2){
									
									result.buying_id += article_id + '#';
									result.save(function(err){
										if(err){
											console.error(err);
											res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
											res.write('<script>alert("error");window.location.href="/"</script>');
											res.end();
										}
										
										console.log('render:buy.ejs');
										res.render('buy',{req:req,userInfo:result,authorInfo:authorInfo,articleInfo:articleInfo});
									});
								} else{
									res.render('buy',{req:req,userInfo:result,authorInfo:authorInfo,articleInfo:articleInfo});
								}
							}
						} // else
					}); // user.findMyAccount
				}
			});
		}
	});
});

module.exports = route;