import mongoose from 'mongoose';

const Schema=mongoose.Schema;

const userSchema= mongoose.Schema(
    {
        username:{
            type: String,
            minLength: 6,
            maxLength:30,
            required: true
        },
        email:{
            type:String,
            required: true,
            unique:true,
            minLength: 6,
            maxLength:265
        },
        password:{
            type:String,
            required:true,
            default: 'null'
        },
        photo:{
            type:String,
            required:true,
            default:'http://res.cloudinary.com/dtdjhqe3m/image/upload/v1639130909/sfms35llfyh4st0x21ag.png'
        },
        verified:{
            type: Boolean,
            default: false,
        },
        admin:{
            type: Boolean,
            default:false,
        },
        adminThrough:{
            type: mongoose.Types.ObjectId,
            ref:'user'
        },
        savedBlog:{
            type: [{type:mongoose.Types.ObjectId,ref:'blog'}],
        
        },
        createBlog:{
            type: [{type:mongoose.Types.ObjectId,ref:'blog'}]
        }
    },
    {timestamps:true}
);

const User = mongoose.model('user',userSchema);

export default User;