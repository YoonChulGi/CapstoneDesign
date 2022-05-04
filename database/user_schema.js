
const crypto = require('crypto');

let Schema = {};
Schema.createSchema = (mongoose)=>{
	
	let UserSchema = new mongoose.Schema({
		userID:{type:String},
		hashed_password:{type:String, 'default': ' '},
		salt:{type:String,'default': ' '},
		username:String,
		birthday:Number,
		email:String,
		sex:String,
		provider:{type:String, 'default' : ''},
		authToken:{type: String, 'default': ''},
		facebook:{},
		kakao:{},
		basket:{type:String, 'default' : ''},
		talent:String,
		profimg:{type:String, 'default' : ''},
		money:{type:Number,'default':0},
		buying_id:{type:String,'default':''},
		selling_id:{type:String,'default':''},
	});
	UserSchema.static('findById',function(id,callback){
		return this.find({userID:id},callback);
	});
	
	// password를 virtual 메서드로 정의 : MongoDB에 저장
	//되지 않는 편리한 속성. 
	// 특정 속성을 지정하고 set, get 메서드를 정의
	UserSchema
		.virtual('password')
		.set(function(password){
			this._password = password;
			this.salt=this.makeSalt();
			this.hashed_password = this.encryptPassword(password);
			console.log('virtual password 호출됨: '+ this.hashed_password);
		})
		.get(function(){return this._password});
	// 스키마에 모델 인스턴스에서 사용할 수 있는 메서드 추가 
	// 비밀번호 암호화 메서드 
	UserSchema.method('encryptPassword',function(plainText,inSalt){
		if(inSalt){
			return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
		} else{
			return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
		}
	});
	// salt값 만들기 
	UserSchema.method('makeSalt',function(){
		return Math.round((new Date().valueOf()*Math.random())) + '';
	});
	
	// 인증 메서드 - 입력된 비밀번호와 비교 (true/false 리턴)
	UserSchema.method('authenticate',function(plainText,inSalt,hashed_password){
		if(inSalt){
			console.log('inSalt 있을때');
			console.log('authenticate 호출됨: %s -> %s : %s',plainText,this.encryptPassword(plainText,inSalt),hashed_password);
			return this.encryptPassword(plainText,inSalt) == hashed_password;
		} else {
			console.log('authenticate 호출됨: %s -> %s : %s',plainText,this.encryptPassword(plainText),hashed_password);
			return this.encryptPassword(plainText) == hashed_password;
		}
	});
	
	
	
	console.log('UserSchema 정의함.');
	return UserSchema;
}
module.exports = Schema;