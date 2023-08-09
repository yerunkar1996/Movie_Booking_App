var mongo=require('mongoose');
var Schema=mongo.Schema;

var schema=new Schema({
    imagepath:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    date:{type:String,required:true},
    price:{type:Number,required:true}
});

module.exports=mongo.model('Movielist',schema);