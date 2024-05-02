"use client"
import { redirect, useParams } from "next/navigation"; // Import useParams hook
import { useState, useEffect } from "react";
import Profile from "@/components/shared/Profile";
import { useAuth, useSession } from "@clerk/nextjs";
import { getPromptById, getPrompts } from "@/lib/actions/prompt.action";
import { IPrompt } from "@/lib/database/models/prompt.model";
import { getUserById } from "@/lib/actions/user.actions";


interface Prompt {
  _id: string;
  prompt: string;
  tag: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams(); // Retrieve dynamic route parameter
  const [userPosts, setUserPosts] = useState<IPrompt[]>([]);
  const { session } = useSession();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          redirect("/sign-in");
        }
        const user = await getUserById(userId)
        // const prompt = await getPromptById(userId)

        const userPosts = await getPrompts();
        setUserPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchData();
  }, [userId]);// Use id as dependency

  return (
    <Profile
      name={session?.user?.fullName || ""}
      desc={`Welcome to ${session?.publicUserData.firstName}'s profile page`}
      data={userPosts}
      handleDelete={()=>{}}
      handleEdit={()=>{}}
    />
  );
};

export default UserProfile;
