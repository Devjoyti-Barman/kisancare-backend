import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import GithubStrategy from 'passport-github2';
import dotenv from 'dotenv';

import User from '../models/User.js';

dotenv.config();


// we are sending cookie to browser
passport.serializeUser((user,done)=>{
  
  //  we are sending user._id as a cookie to browser 
  
  // null means no error
  done(null,{id:user._id});
})

// we are getting the cookie from browser
passport.deserializeUser((user,done)=>{
  
  // null means no error
  done(null,user);
})



passport.use(
    new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken,refreshToken,profile,done)=>{
        // passport callback function
        // Here google will give us the information about the user
        try {
          const currentUser=await User.findOne({googleID:profile.id});
          
          // check if user already exist in our own db 
          if( currentUser ){
               
            done(null,currentUser);

          } 
          // if user does not exist in our db
          else{
             
              const newUser= new User({
                username: profile.displayName,
                googleEmail: profile._json.email,
                googleID: profile.id,
                photo:profile._json.picture,
              });

              await newUser.save();
              // null means no error call serializeUser and send newUser as argument
              done(null,newUser);
          }

        } catch (error) {
          done(error,profile);
        }
         
        
    })
)

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret:process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    }
  )
);