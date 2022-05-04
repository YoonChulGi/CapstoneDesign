let Schema = {};
Schema.createSchema = (mongoose)=>{
	
	let ArticleSchema = new mongoose.Schema({
		articleNum:{type:Number,default: 0},
		title:{type:String,require:true},
		category:{type:String,require:true},
		author:{type:String,require:true},
		author_id:{type:String,require:true},
		discribe:String,
		price:String,
		picture:String,
		datetime:{type:Date,require:true,default:new Date()},
		count:{type:Number,default: 0},
		
	});
	ArticleSchema.static('findAuthor',function(author,callback){
		return this.find({author:author},callback);
	});
	
	ArticleSchema.static('findAuthor_id',function(author_id,callback){
		return this.find({author_id:author_id},callback);
	});
	
	ArticleSchema.static('findCategory',function(category,callback){
		return this.find({category:category},callback);
	});
	
	ArticleSchema.static('findById',function(id,callback){
		return this.find({_id:id},callback);
	});
	ArticleSchema.static('findByTitle',function(title,callback){
		console.log('findByTitle called: ' + title );
		return this.find({title:{$search:title}},callback);
	});
	
	
	
	console.log('ArticleSchema 정의함.');
	return ArticleSchema;
}
module.exports = Schema;