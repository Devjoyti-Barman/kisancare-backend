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
    else if( confirm_password===undefined ) throw 'confirm-password is undefined';
    else if( password != confirm_password) throw 'password and confirm-password is not same';
    
}


const CreateUser=async(req,res)=>{
    
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

            const newUserToken=new Token({
                userID:newUser._id
            });

            await newUser.save();
            await newUserToken.save();

            
           const email_validate_url=`http://localhost:3001/confirmation/${newUserToken._id}`;

            const mailOptions={
                from:'Kisan Care',
                to:email,
                subject:'Confirm Email',
                text:`click to this to verify your email ${email_validate_url}`,
                html:`Please click this email to confirm your email: <a href=${email_validate_url}>${email_validate_url}</a>`
            }

            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                    return res.status(201).json({
                        message:'user created successfully.\n Check email for email validation'
                    });
                }
            }); 
              
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
        
        // if token exist
        if( getToken ){
            
            const newUser=await User.findById(getToken.userID);

            if( newUser ){

                newUser.verified=true;
                await newUser.save();
                return res.status(202).json({message:'the user is verified'});

            } 
            
            else
                return res.status(400).json({message:'The user does not exist'});
            

        }

        else
            return res.status(404).json({message:'The session has expired'});
        
    } catch (error) {
        console.log(error);
        res.status(404).json({message:'Something went wrong. Please try again'});
    }
}


export {
    CreateUser,
    ValidateEmail
}