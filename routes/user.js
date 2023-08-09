var express = require('express');
var router = express.Router();
var csrf=require('csurf');
var passport=require('passport');
var Order=require('../models/order');
var Cart=require('../models/cart');
var csrfmid=csrf();
router.use(csrfmid);
 
//account
router.get('/account',isLoggedIn,function(req,res,next){
 Order.find({user:req.user},function(err,orders){
   if(err) throw err;
   var cart;
   orders.forEach(function (order){
     cart=new Cart(order.cart);
     order.items=cart.generateArray();
   });
   res.render('user/account',{orders:orders});
 });
 
});
 
//logout
router.get('/logout',isLoggedIn,function(req,res,next){
  req.logout();
  res.redirect('/');
});
 
//notloggedin
router.use('/',notLoggedIn,function(req,res,next){
  next(); 
});
 
//routing for signup
router.get('/signup',function(req,res,next){
  var messages=req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});
 
//post signup
router.post('/signup',passport.authenticate('local.signup',{
  successRedirect:'/user/account',
  failureRedirect:'/user/signup',
  failureFlash:true
}));





 
////routing for signin
router.get('/signin',function(req,res,next){
  var messages=req.flash('error');
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});
 
//post signin
router.post('/signin',passport.authenticate('local.signin',{
  successRedirect:'/user/account',
  failureRedirect:'/user/signin',
  failureFlash:true
}));
 
module.exports = router;
 
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
 
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}