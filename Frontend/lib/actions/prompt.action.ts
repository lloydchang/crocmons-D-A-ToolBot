"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Prompt from "../database/models/prompt.model";
import { redirect } from "next/navigation";


const populateUser = (query: any) => query.populate({
  path: 'creator',
  model: User,
  select: '_id email photo username clerkId'
})



// Function to get all prompts
export async function getPrompts() {
    try {
      // Connect to the database
      await connectToDatabase();
  
      // Retrieve all prompts and populate user data
      const prompts = await populateUser(Prompt.find({}));
  
      // Return the prompts
      return JSON.parse(JSON.stringify(prompts));
    } catch (error) {
      // Handle errors
      handleError(error);
    }
  }




// ADD IMAGE
export async function createPrompt({ userId, prompt, path }: CreatePrompt) {
  try {
    await connectToDatabase();

    const creator = await User.findById(userId);

    if (!creator) {
      throw new Error("User not found");
    }

    const newPrompt = await Prompt.create({
      prompt:prompt.prompt,
      tag:prompt.tag,
      creator: creator._id,
    })

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newPrompt));
  } catch (error) {
    handleError(error)
  }
}

// UPDATE PROMPT
export async function updatePrompt({ userId, prompt, path }: UpdatePrompt) {
  try {
    await connectToDatabase();

    const promptToUpdate = await Prompt.findById(prompt._id);

    if (!promptToUpdate || promptToUpdate.creator.toHexString() !== userId) {
      throw new Error("Unauthorized or prompt not found");
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
        promptToUpdate._id,
      prompt,
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedPrompt));
  } catch (error) {
    handleError(error)
  }
}

// DELETE IMAGE
export async function deletePrompt(promptId: string) {
  try {
    await connectToDatabase();

    const deletedPrompt = await Prompt.findByIdAndDelete(promptId);

    if (!deletedPrompt) {
        throw new Error("Prompt not found");
      }
  
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/')
  }
}

// GET IMAGE
export async function getPromptById(promptId: string) {
  try {
    await connectToDatabase();

    const prompt = await populateUser(Prompt.findById(promptId));

    if(!prompt) throw new Error("Prompt not found");

    return JSON.parse(JSON.stringify(prompt));
  } catch (error) {
    handleError(error)
  }
}

