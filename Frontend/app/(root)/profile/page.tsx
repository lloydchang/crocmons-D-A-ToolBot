"use client"
import React, { useEffect, useState } from 'react';
import { useSession, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Profile from '@/components/shared/Profile';
import { getPromptById, deletePrompt, getPrompts } from '@/lib/actions/prompt.action';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { IPrompt } from '@/lib/database/models/prompt.model';

interface Prompt {
  _id: string;
  prompt: string;
  tag: string;
}

const MyProfile: React.FC = async () => {
  const [posts, setPosts] = useState<IPrompt[]>([]);
  const { session } = useSession();
  const { userId } = useAuth();
  const router = useRouter()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          redirect("/sign-in");
        }
        const user = await getUserById(userId)
        // const prompt = await getPromptById(userId)

        const userPosts = await getPrompts();
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleEdit = (prompt: IPrompt) => {
    router.push(`/update-prompt?id=${prompt?.creator?._id}`);
  };

  const handleDelete = async (prompt: IPrompt) => {
    const hasConfirmed = confirm('Are you sure you want to delete?');
  
    if (hasConfirmed) {
      try {
        await deletePrompt(prompt.creator?._id); // Use prompt.creator._id
        const filteredPrompt = posts.filter(p => p?.creator?._id !== prompt?.creator?._id); // Adjusted filter condition
        setPosts(filteredPrompt);
      } catch (error) {
        console.error('Error deleting prompt:', error);
      }
    }
  };
  

  return (
    <Profile
      name='All'
      desc='Shared Prompt'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
