var Movielist=require('../models/movielist');
var mongo=require('mongoose');
mongo.connect('mongodb://localhost:27017/moviebooking');
 
var movies=[
    new Movielist({
        imagepath:'https://lh3.googleusercontent.com/proxy/po-w-TzWLlzDLptSWIpEfY6EVa4mLGstTfDUtJKLa7UC_tS2b_91TXvIi1WfT8dHrbECFrkqRw6zaFpzu-JBiiCNVl7aZwUPmhJfBSdBxMGL',
        title:'Tom & Jerry',
        description:'Entertainment Movie',
        date:'1th jan-22 5 pm',
        price:110
    }),
 
    new Movielist({
        imagepath:'https://assets.thehansindia.com/h-upload/2020/10/13/1005357-chhota-bheem.webp',
        title:'Chota Bheem',
        description:'Entertainment Movie',
        date:'6th jan-22 5 pm',
        price:115
    }),
 
    new Movielist({
        imagepath:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY4vpQtPKj47iGObqRtG6usoNpWES2pvPZgXK2T8V3TmGzhoBfQUlLQeea9uA3gumzn1o&usqp=CAU',
        title:'Spyderman',
        description:'Entertainment Movie',
        date:'15th jan-22 5 pm',
        price:150
    }),
 
];
 
var done=0;
for(var i=0;i<movies.length;i++){
    movies[i].save(function(err,res){
        if(err) throw err;
          done++;
          if(done==movies.length){
              exit();
          }
    });
}
function exit(){
  mongo.disconnect();  
}