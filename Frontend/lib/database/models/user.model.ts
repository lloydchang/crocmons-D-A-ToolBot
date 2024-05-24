import { Schema, model, models } from "mongoose";


const UserSchema = new Schema({
    // _id:{type:String,required:true,unique:true},
    clerkId:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    username:{type:String, required:true, unique:true},
    photo:{type:String, required:true},
    firstName:{type:String},
    lastName:{type:String},
    // planId:{type:Number, default:1},
    prompts: {
        type: Schema.Types.ObjectId,
        ref: "Prompt" // Assuming 'User' is the name of the referenced model
     },
})

const User = models?.User || model("User", UserSchema);


export default User

