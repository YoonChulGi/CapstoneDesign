const mongoose = require('mongoose');
let database ={};
database.init = (app,config)=>{
	console.log('init() called ');
	connect(app,config);
}
function connect (app,config) {
	console.log('connect() called');
	const databaseUrl = config.db_url;
	mongoose.Promise = global.Promise;
	mongoose.connect(databaseUrl);
	database = mongoose.connection;
	database.on('error',console.error.bind(console,'mongoose connection error'));
	database.on('open',()=>{
		console.log('데이터베이스에 연결되었습니다: '+ databaseUrl);
		app.set('database',database);
	});
}
function createSchema(app,config) {
	let schemaLen = config.db_schemas.length;
	console.log('스키마 갯수: '+ schemaLen);
	
	for(let i=0;i<schemaLen;i++) {
		let curItem = config.db_schemas[i];
		
		let curSchema = require(curItem.file).createSchema(mongoose);
		console.log(curItem.file+'module을 불러들인 후 스키마 정의함');
		
		let curModel = mongoose.model(curItem.collection,curSchema);
		console.log(curItem.collection + '컬렉션을 위해 모델 정의');
		
		database[curItem.schemaName] = curSchema;
		database[curItem.modelName] = curModel;
		console.log('스키마 이름['+curItem.schemaName +']');
		console.log('모델 이름['+curItem.modelName +']');
	}
	app.set('database',database);
	console.log('database 객체가 app 객체의 속성으로 추가됨');
}

module.exports = database;