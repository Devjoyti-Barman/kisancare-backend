import express from 'express';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import cors from 'cors';

import './helpers/passport-google.js';

import connectDB from './connection/db.js';
import passport from 'passport';
import isLogin from './middlewares/isLogin.js';
import googleAuth from './routes/authentication.js';
import blogRoute from './routes/blog.js'

dotenv.config();

const app= express();
app.use(cors());
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys:[process.env.cookie_key_secret_1,process.env.cookie_key_secret_2]
}));

// initialize passport for cookie-session
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());

app.use('/blog',blogRoute);
app.use('/auth',googleAuth);

app.use("/home",isLogin,(req,res)=>{
  console.log(req.user);
  res.send(`welcome ${req.user}`)} );
  
app.use("/",(req,res)=>res.send("<a href=auth/google>Sign in </a> "));


connectDB();
const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`The server started at http://localhost:${PORT}`)
});



