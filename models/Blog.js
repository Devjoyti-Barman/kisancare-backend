import mongoose from 'mongoose';

const Schema= mongoose.Schema;

const BlogSchema= mongoose.Schema(
    {
        title:{
            type:String,
            minLength: 6,
            maxLength:50,
            required:true
        },
        frontImage:{
          type:String,
          minLength:8,
          required:true
        },
        author:{
            type:String,
            minLength:6,
            maxLength:30,
            required:true
        },
        createdBy:{
            type:String,
            required:true
        },
        body:{
            type:String,
            minLength:6,
            required:true
        },


    },
    {timestamps:true}
)


const Blog=mongoose.model('blog',BlogSchema);

export default Blog;