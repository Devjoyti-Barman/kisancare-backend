import  Blog from '../models/Blog.js';

async function createBlog(req,res,next){
    
    try {
        const newBlog=new Blog({
            title:req.body.title,
            frontImage:req.body.frontImage,
            body:req.body.body,
            author:req.user.username,
            createdBy:req.user.id
        });
        await newBlog.save();

        res.status(200).json({
            success:true,
            message:'successful',
        });
        
    } catch (error) {
        res.status(401).json({
            success:false,
            message:'something went wrong',
        });
    }


    
   
}


export{
    createBlog
}