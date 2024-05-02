import { Schema, model, models } from "mongoose";


export interface IPrompt extends Document {
   prompt:string;
   tag:string;
   creator:{
       _id:string;
       firstName:string;
       lastName:string;
       username:string;
   };
   createdAt?:Date;
   updatedAt?:Date;
}


const PromptSchema = new Schema({
     creator:{
        type: Schema.Types.ObjectId,
        ref:"User"
     },
     prompt:{
        type:String,
        required:[true, 'Prompt is required']
     },
     tag:{
        type:String,
        required:[true, 'Tag is required']
     }
})

const Prompt = models.Prompt || model('Prompt', PromptSchema)

export default Prompt;