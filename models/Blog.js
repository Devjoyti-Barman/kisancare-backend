import mongoose from 'mongoose';

const Schema= mongoose.Schema;

const BlogSchema= mongoose.Schema(
    {
        title:{
            String,
            minLength: 6,
            maxLength:50,
            required
        },
        author:{
            String,
            minLength:6,
            maxLength:30
        },
        body:{
            String,
            minLength:6,
            required
        },


    },
    {timestamps:true}
)


const Blog=mongoose.model('blog',BlogSchema);

export default BlogSchema;