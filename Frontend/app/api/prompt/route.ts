// import { connectToDatabase } from "@/lib/database/mongoose";
// import Prompt from "@/lib/database/models/prompt.model";


// export const GET = async(req:Request)=>{
    
//     try {
//         await connectToDatabase();

//         const prompts = await Prompt.find({});

//         return new Response(JSON.stringify(prompts),{status:200})
        
//     } catch (error) {
//        new Response('Failed to load the data',{status:500}) 
//        console.log(error)
//     }
// }