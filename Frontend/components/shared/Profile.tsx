import React from 'react';
import PromptCard from './PromptCard';
import { IPrompt } from '@/lib/database/models/prompt.model';

interface Prompt {
  _id: string;
  prompt: string;
  tag: string;
}

interface ProfileProps {
  name: string;
  desc: string;
  data: IPrompt[];
  handleEdit: (prompt: IPrompt) => void;
  handleDelete: (prompt: IPrompt) => void;
}

const Profile: React.FC<ProfileProps> = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className='w-full flex-wrap md:ml-[-55px] flex flex-col justify-center gap-5 mx-auto'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Profile</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      <div className='mt-10 prompt_layout'>
        {data.map(prompt => (
          <PromptCard
            key={prompt.creator?._id}
            prompt={prompt}
            handleEdit={() => handleEdit && handleEdit(prompt)}
            handleDelete={() => handleDelete && handleDelete(prompt)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
