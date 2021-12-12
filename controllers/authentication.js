import dotenv from 'dotenv';
import EmailValidator  from 'email-validator';
import nodemailer from 'nodemailer';
import brcypt from 'bcryptjs';
import User from "../models/User.js"
import Token from '../models/Token.js';


dotenv.config();

const transporter = nodemailer.createTransport({
  
    service: 'gmail',
    auth: {
      user: process.env.nodemailer_account,
      pass: process.env.nodemailer_password
    }
});



const Validate_Credentials_of_signup=(username,email,password,confirm_password)=>{
    
    if( username===undefined )  throw 'username is undefined';
    else if( username.length <5 ) throw 'username must be greater than 4';
    else if( email===undefined ) throw 'email is undefined';
    else if( EmailValidator.validate(email) ===false ) throw 'email is not valid';
    else if( password===undefined ) throw 'password is undefined';
    else if( password.length <6 ) throw 'password length must be greate than 5';
    else if( confirm_password===undefined ) throw 'confirm-password is undefined';
    else if( password != confirm_password) throw 'password and confirm-password is not same';
    
}


const Validate_Credentials_of_signin=(email,password)=>{

    if( email===undefined ) throw 'email is undefined';
    else if( EmailValidator.validate(email) ===false ) throw 'email is not valid';
    else if( password===undefined ) throw 'password is undefined';
    else if( password.length <6 ) throw 'password length must be greate than 5';
}

const sendEmail_To_Validate_Email=async (user)=>{
    
    return new Promise( async(resolve,reject) =>{
           
        try {

            // if the user is already verified
            if( user.verified===true ) return reject({status:400,error:'The user is already verified'});

            const newUserToken=new Token({
                userID:user._id,
                type:'validate user'
            });
              
            await newUserToken.save();
        
            const email_validate_url=`http://localhost:3001/confirmation/${newUserToken._id}`;
        
            const mailOptions={
                from:'Kisan Care',
                to:user.email,
                subject:'Confirm Email',
                text:`click to this to verify your email ${email_validate_url}`,
                html:`Please click this email to confirm your email: <a href=${email_validate_url}>${email_validate_url}</a>`
            }
    
               
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                   
                   reject({status:503,error:error});
                   
                } else {
                    resolve(true);
                }
        
            });

        } catch (error) {

            reject({error,status:400});
        }
          
          
    })



 
}

const sendEmail=async (to,subject,text,html)=>{
    
    return new Promise( async(resolve,reject) =>{
           
        try {

        
            const mailOptions={
                from:'Kisan Care',
                to:to,
                subject:subject,
                text:text,
                html:html
            }
    
               
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                   
                   reject({status:503,error:error});
                   
                } else {
                    resolve(true);
                }
        
            });

        } catch (error) {

            reject({error,status:400});
        }
          
          
    })
 
}

const SignUp=async(req,res)=>{
    
    const {username,email,password,confirm_password} = req.body;    
     

    try {
       

        // validating the Credentials of Singnup

        Validate_Credentials_of_signup(username,email,password,confirm_password);
        
        const Existeduser =await User.findOne({email:email});

        if( Existeduser ){

            return res.status(400).json({
                message:'the user is already exist'
            });
        }

        else{
        
            const salt =await brcypt.genSalt(10);
            const hashPassword=await brcypt.hash(password,salt);

            const newUser=new User({
                email,
                username,
                password:hashPassword
            });

            await newUser.save();

            await sendEmail_To_Validate_Email(newUser);
            
            res.status(202).json({message:'user created successfully.\n Check email for email validation.'});
            
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message:error
        });
    }

}

const ValidateEmail=async(req,res)=>{

    const {tokenID}=req.params;
    
    try {
        
        const getToken=await Token.findById(tokenID);
        const type='validate user';
        // if token exist
        if( getToken && getToken.type===type){
            
            const newUser=await User.findById(getToken.userID);

            if( newUser ){

                newUser.verified=true;
                await newUser.save();
                return res.status(202).json({message:'the user is verified'});

            } 
            
            else
                return res.status(200).json({message:'The user does not exist'});
            

        }

        else
            return res.status(200).json({message:'The session has expired'});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({message:'Something went wrong. Please try again'});
    }
}

const SignIn=async(req,res,next)=>{
    
    const {email,password}=req.body;
    
   
    try {

        Validate_Credentials_of_signin(email,password);

        const currrent_user= await User.findOne({email});

        if( currrent_user ){

              
            if( currrent_user.verified ===true ) {

                   
                const isSamePassword= await brcypt.compare(password,currrent_user.password);

                if(isSamePassword===false) {
                    res.status(202).json({message:'The email or password is wrong'});
                    return;
                }
                else
                   next();

            }

            else{
               
               await sendEmail_To_Validate_Email(currrent_user);
               res.status(202).json({message:'email is not verified.\n Check your email to verify the user.'});
            }
        }
        
        else
           throw 'user does not exist';
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }

}

const ForgotPassword=async(req,res)=>{
      
    const {tokenID,password,confirm_password}=req.body;
    const type='change password';
        

    try {
        
        // validating data send from client

        if( tokenID===undefined ) return res.status(200).json({msg:'The tokenID is undefined'});
        else if( password===undefined ) return res.status(200).json({msg:'The Password is emapty'});
        else if( password.length <6 ) return res.status(200).json({msg:'The Password length must be greater than 5'});
        else if( password != confirm_password ) return res.status(200).json({msg:'The password and confirm password is different'});

        const token=await Token.findById(tokenID);

        // token is does not exist
        if( !token ) return res.status(200).json({msg:'The token is invalid'});
        
        // if the token type is not same 
        if( token.type != type ) return res.status(200).json({msg:'The token is invalid'});


        const user=await User.findById(token.userID);
        
       

        const salt =await brcypt.genSalt(10);
        const hashPassword=await brcypt.hash(password,salt);

        user.password=hashPassword;

        await user.save();

        return res.status(202).json({msg: 'The password changed successfully.'});

    } catch (error) {
        console.log(error);
    }
}

const Generate_forgot_password_token=async(req,res)=>{
    
    const {email}=req.body;

    try {
        
        // validating email

        if( email===undefined ) return res.status(200).json({msg:'email is undefined'});
        else if( EmailValidator.validate(email) ===false ) return res.status(200).json({msg:'email is not valid'});
        
        const user= await User.findOne({email});
        
        // if the user exist
        if( user ){
            
            // if the user does not verified

            if( user.verified===false ){

                await sendEmail_To_Validate_Email(user);
                return res.status(200).json({msg:'email is not verified.\n Check your email to verify the user.'});
            } 
            else {

                const userToken=new Token({userID:user._id,type:'change password'});
                await userToken.save();
                
                // sending mail

                const url=`http://localhost:3001/change/password/${userToken._id}`;
                const subject=`Change Password`;
                const messageText=`Click here to chnage the password ${url}`;
                const messageHTML=` <h1> Please click here to change your password <a href=${url}>${url}</a> </h1>`;

                await sendEmail(user.email,subject,messageText,messageHTML);
                
                return res.status(202).json({msg:'check your email to change the password'});
            }
 
        } 
        else
           return res.status(200).json({msg:'the user does not exist.'});
        

    } catch (error) {
        
        return res.status(400).json({msg:'something went wrong',error:error});
    }
}

export {
    SignUp,
    ValidateEmail,
    SignIn,
    ForgotPassword,
    Generate_forgot_password_token
}