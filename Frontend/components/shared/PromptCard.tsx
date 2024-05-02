"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession} from "@clerk/nextjs";
import { useRouter, usePathname } from 'next/navigation';
import { IPrompt } from '@/lib/database/models/prompt.model';


interface Props {
  prompt: IPrompt;
  handleTagClick?: (tag: string) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const PromptCard: React.FC<Props> = ({ prompt, handleTagClick, handleEdit, handleDelete }) => {
  const { session} = useSession();
  const router = useRouter();
  const path = usePathname()

  const [copied, setCopied] = useState('');

  const handleCopy = () => {
    console.log(prompt)
    setCopied(prompt?.prompt);
    navigator.clipboard.writeText(prompt?.prompt);
    setTimeout(() => {
      setCopied('');
    }, 3000);
  };

  const handleProfileClicked = () => {
    if (prompt.creator?._id === session?.user?.publicMetadata[0]) {
      console.log(prompt)
      router.push('/profile');
    } else {
      router.push(`/profile/${session?.user?.publicMetadata[0]}?name=${session?.user?.fullName}`);
    }
  };
  // console.log(session?.publicUserData)
  return (
    <div className='prompt_card'>
      <div className='flex justify-between items-start gap-5'>
        <div className='flex-1 flex justify-start items-center gap-3 cursor-pointer' onClick={handleProfileClicked}>
          <Image
            src={session?.user?.imageUrl || ''}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />
          <div className='flex flex-col'>
            <h3 className='font-semibold font-satoshi text-gray-900 dark:text-white'>{session?.user?.username}</h3>
            <p className='font-inter text-sm text-gray-500 dark:text-gray-100'>{session?.publicUserData?.identifier}</p>
          </div>
        </div>
        <div className='copy_btn' onClick={handleCopy}>
          <Image
            src={copied === prompt?.prompt ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
            alt='copy'
            className='dark:w-13 dark:h-13 dark:font-semibold shadow-lg'
            width={16}
            height={16}
          />
        </div>
      </div>
      <p className='mt-4 mb-2 font-satoshi text-md text-gray-700 dark:text-white'>{prompt?.prompt}</p>
      <p
        className='font-inter my-2 text-sm orange_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick("")}
      >
        {prompt?.tag}
      </p>
      {session?.user?.publicMetadata[0] === prompt.creator?._id && path === '/profile' && (
        <div className='mt-5 flex-center gap-5 justify-evenly border-t border-gray-100 pt-3'>
          <button
            className='font-inter text-md green_gradient cursor-pointer rounded-lg py-2 px-2 border border-gray-500 font-semibold'
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className='font-inter text-md font-semibold orange_gradient cursor-pointer rounded-lg py-2 px-2 border border-gray-500'
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
