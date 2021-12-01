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
        googleEmail:{
            type:String,
            required: true,
            unique:true,
        },
        googleID:{
            type:String,
            required:true,
            unique:true
        },
        photo:{
            type:String,
            required:true
        },
        admin:{
            type: Boolean,
            default:false,
        },
        adminThrough:{
            type: mongoose.Types.ObjectId,
            ref:'user'
        }
    },
    {timestamps:true}
);

const User = mongoose.model('user',userSchema);

export default User;