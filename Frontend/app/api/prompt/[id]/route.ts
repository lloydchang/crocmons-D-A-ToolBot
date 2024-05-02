// import { connectToDatabase } from "@/lib/database/mongoose";
// import Prompt from "@/lib/database/models/prompt.model";
// import { Response } from "express";

// interface Request {
//   params: {
//     id: string;
//   };
//   json: () => Promise<{ prompt: string; tag: string }>;
// }

// export const GET = async (req: Request, res: Response): Promise<void> => {
//   try {
//     await connectToDatabase();

//     const prompt = await Prompt.findById(req.params.id);

//     if (!prompt) {
//       res.status(404).send('Prompt not found');
//       return;
//     }

//     res.status(200).json(prompt);
//   } catch (error) {
//     console.error("Failed to fetch data", error);
//     res.status(500).send("Failed to fetch data");
//   }
// };

// export const PATCH = async (req: Request, res: Response): Promise<void> => {
//   try {
//     await connectToDatabase();
//     const { prompt, tag } = await req.json();

//     const existingPrompt = await Prompt.findById(req.params.id);

//     if (!existingPrompt) {
//       res.status(404).send("Prompt is not found");
//       return;
//     }

//     existingPrompt.prompt = prompt;
//     existingPrompt.tag = tag;

//     const updatedPrompt = await existingPrompt.save();

//     res.status(200).json(updatedPrompt);
//   } catch (error) {
//     console.error("Failed to update the prompt", error);
//     res.status(500).send("Failed to update the prompt");
//   }
// };

// export const DELETE = async (req: Request, res: Response): Promise<void> => {
//   try {
//     await connectToDatabase();
//     await Prompt.findByIdAndDelete(req.params.id);
//     res.status(200).send('Prompt Deleted successfully');
//   } catch (error) {
//     console.error("Failed to delete the prompt", error);
//     res.status(500).send("Failed to delete the prompt");
//   }
// };
