"use client"
import React, { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Form from '@/components/shared/Form';
import { createPrompt } from '@/lib/actions/prompt.action'; 
import { getUserById } from '@/lib/actions/user.actions';
import { useAuth } from '@clerk/nextjs';

const CreatePrompt: React.FC = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [post, setPost] = useState({
    _id: '',
    prompt: '',
    tag: ''
  });
  const { userId } = useAuth();

  const handleCreatePrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      if (!userId) {
        redirect("/sign-in");
      }
      const user = await getUserById(userId)
      const path = '/'; 
      await createPrompt({ userId:user, prompt: post, path }); 
      router.push('/');
    } catch (error) {
      console.error('Error creating prompt:', error);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Form
      type='Create'
      post={post}
      setPost={setPost}
      submitted={submitted}
      handleSubmit={handleCreatePrompt}
    />
  );
};

export default CreatePrompt;
