"use client"

import React, { useEffect, useState } from 'react';
import PromptCard from '@/components/shared/PromptCard';
import { getPrompts } from '@/lib/actions/prompt.action'; // Import the backend function
import { IPrompt } from '@/lib/database/models/prompt.model';

interface Post {
  _id: string;
  tag: string;
  prompt: string;
  creator:{
    _id:string;
    firstName:string;
    lastName:string;
    username:string;
};
}


interface Props {
  data: Post[];
  handleTagClick: (tagname: string) => void;
}

const PromptCardList: React.FC<Props> = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          prompt={post.prompt}
          handleTagClick={handleTagClick}
          handleEdit={() => {}}
          handleDelete={() => {}}
        />
      ))}
    </div>
  );
};

const Feed: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedResults, setSearchedResults] = useState<Post[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const filteredPrompts = (searchtext: string): Post[] => {
    const regex = new RegExp(searchtext, 'i');
    return posts.filter(
      (postItem) =>
        regex.test(postItem.creator.username) ||
        regex.test(postItem.tag) ||
        regex.test(postItem.prompt)
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    clearTimeout(searchTimeout!);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filteredPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagname: string): void => {
    setSearchText(tagname);
    const searchTagResult = filteredPrompts(tagname);
    setSearchedResults(searchTagResult);
  };

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        const data = await getPrompts(); // Call the backend function directly
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className='feed'>
      <form className=' w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or the prompt....'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer shadow-2xl'
        />
      </form>

      <PromptCardList
        data={searchText ? searchedResults : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
