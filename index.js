import express from 'express';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import cors from 'cors';
import passport from 'passport';

import './helpers/passport.js';

import connectDB from './connection/db.js';
import isLogin from './middlewares/isLogin.js';
import googleAuth from './routes/authentication.js';
import blogRoute from './routes/blog.js'

dotenv.config();

const app= express();
app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true,
  })
);
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
  res.send(`welcome ${req.user.username}`)} 
);
  


connectDB();
const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`The server started at http://localhost:${PORT}`)
});



