import React from 'react';
import Link from 'next/link';

interface FormProps {
  type: string;
  post: {
    _id: string;
    prompt: string;
    tag: string;
  };
  setPost: React.Dispatch<{ _id:string, prompt: string; tag: string }>;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}



const Form: React.FC<FormProps> = ({
  type,
  post,
  setPost,
  submitted,
  handleSubmit,
}) => {

  const handleKeyDown = (e : any)=>{
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
    }
  }

  return (
    <section className='w-full max-w-full flex-start flex-col bg-feature-bg bg-right-bottom bg-no-repeat'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Prompt</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {type} and share your AI prompt with worldwide people.
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism border border-gray-900 shadow-black shadow-2xl bg-feature-bg bg-center bg-no-repeat'
        onKeyDown={handleKeyDown}
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700 dark:text-gray-200'>
            Your AI Prompt
          </span>

          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder='write your prompt here....'
            required
            className='form_textarea shadow-lg border border-gray-200'
          />
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700 dark:text-gray-200'>
            Tag{' '}
            <span className='font-normal'>
              ( #product, #python, #javascript, #webDevelopment, #idea )
            </span>
          </span>

          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            placeholder='#tag'
            required
            className='form_input shadow-lg border border-gray-200'
          />
        </label>

        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/'className='dark:text-gray-200 text-sm shadow bg-red-500 rounded-full px-5 py-1.5 text-white '>
            Cancel
          </Link>

          <button
            type='submit'
            disabled={submitted}
            className='px-5 py-1.5 text-sm bg-blue-500 text-white rounded-full font-semibold'
          >
            {submitted ? `${type}...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
