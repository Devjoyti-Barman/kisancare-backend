import  Blog from '../models/Blog.js';

async function createBlog(req,res,next){
    
    try {
        const newBlog=new Blog({
            title:req.body.title,
            frontImage:req.body.frontImage,
            body:req.body.body,
            author:req.user.username,
            createdBy:req.user.id,
            tags:req.body.tags
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

async function showBlog(req,res,next){

    try {
        const {blogID} = req.params;
        const currentBlog= await Blog.findById(blogID);
        
        if(currentBlog) {
            res.status(200).json({
                data:currentBlog
            });
        }else{
            res.status(404).json({
                message:'The Blog does not exist'
            });
        }

    
    } catch (error) {
        res.status(404).json({
           message:'Something went Wrong',
           error:error
        });
    }
}


export{
    createBlog,
    showBlog
}