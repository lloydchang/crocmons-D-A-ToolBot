"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from '@/components/shared/Form';
import { createPrompt } from '@/lib/actions/prompt.action'; // Import the backend function

const CreatePrompt: React.FC = () => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [post, setPost] = useState({
    _id: '',
    prompt: '',
    tag: ''
  });

  const handleCreatePrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const userId = 'userId'; // Provide the userId here, you might get it from authentication
      const path = '/'; // Provide the path to revalidate cache
      await createPrompt({ userId, prompt: post, path }); // Call the backend function directly
      
      router.push('/');
    } catch (error) {
      console.error('Error creating prompt:', error);
      // Optionally, you can show an error message to the user
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
