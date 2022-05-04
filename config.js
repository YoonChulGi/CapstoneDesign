module.exports = {
	server_port : 3001,
	db_url : 'mongodb://localhost:27017/local',
	db_schemas : [
		//file : schema file, collection: 데이터베이스의 컬렉션 이름을 지정, schenaName: 스키마 파일을 불러들인 후 반환된 객체를 어떤 속성 이름으로 할 것인지 
		// modelName: 스카미에서 모델 객체를 만든 후 어떤 속성 이름으로 할 것인지 
		{file:'./user_schema',collection:'users', schemaName:'UserSchema',modelName:'UserModel'	}
	],
	route_info: [
	    //===== User =====//
		{file:'./user', path:'/confirm', method:'confirm', type:'post'}			 
	    ,{file:'./user', path:'/adduser', method:'adduser', type:'post'}		 
	    ,{file:'./user', path:'/login', method:'login', type:'get'}
	],
	facebook : {
		clientID: '232804914056030',
		clientSecret: '61ca40a891704e527dcd52be2e9ed5fe',
		callbackURL:'/auth/facebook/callback',
	},
	kakaotalk : {
		clientID:'5b090bb4f8284678ea1d61c72a87f00e',
		clientSecret:'wyCz7oSRJbpqO6vs6JOx8ojmNy99ABda',
		callbackURL:'http://localhost:3001/oauth/kakao/callback'
	}
}
