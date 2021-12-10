import mongoose from 'mongoose';


const TokenSchema= mongoose.Schema(
    {
        userID:{
            type: mongoose.Types.ObjectId,
            required: true
        },
        createdAt:{type:Date,expires:'3m',default:Date.now}
    }
)

const Token=mongoose.model('Token',TokenSchema);

export default Token;