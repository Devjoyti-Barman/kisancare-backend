import  Blog from '../models/Blog.js';
import User from '../models/User.js';

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

async function getBlog(req,res,next){

    try {
        
        const pageNO = Math.max( req.params.pageNO,1 );
        const offSet=9;
        const Skip=(pageNO-1)*offSet;

        const data=await Blog.find({}).skip(Skip).limit(offSet);
        
        res.status(201).json({
            data:data
        });


    } catch (error) {
        res.status(400).json({error:error,msg:'Something went wrong'});
    }
}

async function searchBlog(req,res,next){
    
    try {

        const pageNO = req.query.pageNO===undefined ? 1 : req.query.pageNO;
        const offSet=9;
        const Skip=(pageNO-1)*offSet;
        
        const q=req.query.q;

        if( q===undefined || q.trim() ===''){
            
            const data=await Blog.find({}).skip(Skip).limit(offSet);
            res.status(201).json({data});
        
        }else{
            const query= q.split(' ');
            const data=await Blog.find().where('tags').in(query).skip(Skip).limit(offSet);
            res.status(201).json({data});
        }


    } catch (error) {
        res.status(400).json(error);
    }
}

async function saveBlog(req,res,next){
    
    try {
        
        const user=await User.findById(req.user.id);
        
        user.savedBlog.push(req.body.blogID);
        
        user.save()
        .then(()=>{
            res.status(202).json({msg:'blog saved successfully'});
        })
        .catch((error)=>res.status(200).json({msg:'the blog is saved already'}));
        
    } catch (error) {
        res.status(400).json({error:error,msg:'something went wrong'});
    }
}

async function getSaveBlog(req,res,next){

    try {
        
        const user =await User.findById(req.user.id).populate('savedBlog');
        res.status(202).json({savedBlog:user.savedBlog});

    } catch (error) {
        res.status(400).json({error:error,msg:'something went wrong'});
    }
}

export{
    createBlog,
    showBlog,
    getBlog,
    searchBlog,
    saveBlog,
    getSaveBlog
}