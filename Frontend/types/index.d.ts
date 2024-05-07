/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
    _id:string;
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  
  declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    username: string;
    photo: string;
  };
  
  // ====== Prompt PARAMS
  declare type CreatePrompt = {
    prompt:{
      _id: string;    
      prompt: string;
      tag: string;
    };
    userId: string;
    path: string;
  };
  
  declare type UpdatePrompt = {
    prompt:{
      _id: string;    
      prompt: string | undefined;
      tag: string | undefined;
    };
    userId: string;
    path: string;
  };
  
  
  // ====== TRANSACTION PARAMS
  declare type CheckoutTransactionParams = {
    plan: string;
    credits: number;
    amount: number;
    buyerId: string;
  };
  
  declare type CreateTransactionParams = {
    stripeId: string;
    amount: number;
    credits: number;
    plan: string;
    buyerId: string;
    createdAt: Date;
  };
  
  