var express = require('express');
var router = express.Router();
var Cart=require('../models/cart');
var Movielist=require('../models/movielist');
var Order=require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg=req.flash('success')[0];
  Movielist.find(function(err,doct){
    if(err) throw err;
    var movieChunks=[];
    var chunkSize=3;
    for(var i=0;i<doct.length;i+=chunkSize){
      movieChunks.push(doct.slice(i,i+chunkSize))
    }

    res.render('movie/index', {
      title: 'MEAN Project',
      movies:movieChunks,successMsg:successMsg, noMessages:!successMsg });

  });
});

router.get('/add-to-cart/:id', function(req,res,next){
  var MovielistId=req.params.id;
  var cart=new Cart(req.session.cart ? req.session.cart: {});
  
  Movielist.findById(MovielistId ,function(err,movielist){
    if(err){
      return res.redirect('/');
    }
     cart.add(movielist, movielist.id);
     req.session.cart=cart;
     console.log(req.session.cart);
     res.redirect('/');
  });
  });

router.get('/movie-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('movie/movie-cart',{movies:null});
  }
  var cart=new Cart(req.session.cart);
  res.render('movie/movie-cart',{movies:cart.generateArray(),totalPrice:cart.totalPrice});
  });

  router.get('/checkout',isLoggedIn,function(req,res,next){
    if(!req.session.cart){
      return res.render('/movie-cart',{movies:null});
    }
    var cart=new Cart(req.session.cart);
    var errMsg=req.flash('error')[0];
    res.render('movie/checkout',{total:cart.totalPrice,errMsg:errMsg, noErrors:!errMsg});
  });

  router.post('/checkout',isLoggedIn,function(req,res,next){
    if(!req.session.cart){
      return res.render('/movie-cart',{movies:null});
    }
    var cart=new Cart(req.session.cart);
    // Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')
('sk_test_HpOseewlg7jroZ7Fmu66hUf9005d8TvxWu');

stripe.charges.create({
  amount: cart.totalPrice*100,
  currency: 'inr',
  source:"tok_visa",
  description:"Movie ticket booking"
},function(err,charge){
  if(err){
    req.flash('error',err.message);
    return res.redirect('/checkout');
  }
  var order=new Order({
    user:req.user,
    cart:cart,
    address:req.body.address,
    name:req.body.name,
    paymentId:charge.id
  });
  order.save(function(err,result){
    if(err) throw err;
  req.flash('success','Movie Ticket booked');
  req.session.cart=null;
  res.redirect('/');
  });
  

});
  });

  router.get('/reduce/:id',function(req,res,next){
    var MovielistId=req.params.id;
        var cart=new Cart(req.session.cart ? req.session.cart:{});
        cart.reduceByOne(MovielistId);
        req.session.cart=cart;
    res.redirect('/movie-cart');
  });

module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/signin');
}