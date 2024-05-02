// import { connectToDatabase } from "@/lib/database/mongoose";
// import Prompt from "@/lib/database/models/prompt.model";

// // interface Request {
// //     // params:{
// //     //     id:string;
// //     // };

// //     json:()=> Promise<
// //      {
// //         prompt:string;
// //         tag:string;
// //         userId:string
// //      }
// //     >;
// // }



// export const POST = async(req:Request): Promise<Response>=>{
//     const {_id, prompt, tag} = await req.json();

//     try {
//         await connectToDatabase();
//         const newPrompt = new Prompt({
//             creator:_id,
//             prompt,
//             tag
//         })

//         await newPrompt.save();

//         return new Response(JSON.stringify(newPrompt),{status:201})

//     } catch (error) {
//        return new Response('Failed to create a new prompt',{status:500})
//     }
// }