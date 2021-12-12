import express from 'express';
import passport from 'passport';
import isLogin from '../middlewares/isLogin.js';
import { SignIn, SignUp, ValidateEmail } from '../controllers/authentication.js';

const router=express.Router();

const CLIENT_URL='http://localhost:3001/';



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

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect(CLIENT_URL);
})

// auth with google
router.get('/google',passport.authenticate('google',{ scope:['profile','email'] }) );

// callback route for google and serialize will happen
router.get('/google/callback',passport.authenticate('google',{
   successRedirect:CLIENT_URL,
   failureRedirect:'/failed'
   
}));



// local auth.  Creating new user locally

router.post('/create-user',SignUp);

// auth with Local
router.post('/local', 
  SignIn,  
  passport.authenticate('local', { failureRedirect: '/login' }), 
  function(req, res) {
    res.json({message:'successful login'});
  }
);

// validate email

router.get('/validate/email/:tokenID',ValidateEmail);


export default router;