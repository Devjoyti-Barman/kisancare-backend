import express from 'express';
import passport from 'passport';
import isLogin from '../middlewares/isLogin.js';

const router=express.Router();

const CLIENT_URL='http://localhost:3000/';



router.get('/failed',(req,res)=>{
    res.status(401).json({
        success:false,
        message:'failure'
    });
});

router.get('/success',isLogin, (req,res)=>{
    
    res.status(200).json({
        success:true,
        message:'successful',
        user:req.user,
    });
    
});

router.get('/logout', isLogin,(req,res)=>{
    req.logOut();
    res.redirect(CLIENT_URL);
})

// auth with google
router.get('/google',passport.authenticate('google',{ scope:['profile','email'] }) );

// callback route for google and serialize will happen
router.get('/google/callback',passport.authenticate('google',{
   successRedirect:CLIENT_URL,
   failureRedirect:'/failed'
   
}));

export default router;