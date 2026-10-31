import mongoose,{Schema} from "mongoose";

const counterSchema=new Schema({
    _id:{
        type:String,
        required:true,
    },
    sequence_value:{
        type:Number,
        default:0,
    },
});

const Counter=mongoose.model("Counter",counterSchema);

export default Counter;