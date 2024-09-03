'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import loader from "@/public/assets/icons/loader.svg";
import { SignedIn, UserButton } from '@clerk/nextjs';
import botAvatar from "@/public/assets/images/bot.svg"
import send from "@/public/assets/icons/send.svg"
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'bot'; content: string; codeSnippet?: string; expectedOutput?: string; explanation?: string }[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [copied, setCopied] = useState('');

  const handleCopy = (content: any) => {
    setCopied(content);
    navigator.clipboard.writeText(content);
    setTimeout(() => {
      setCopied('');
    }, 3000);
  };

  const chatParent = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]); // Re-run effect whenever messages change

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setIsFetching(true);

    try {
      const res = await fetch('https://data-analysis-toolbot.onrender.com/data-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text_input: query }),
      });

      const data = await res.json();
      console.log(data)
      if (data.code_snippet) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: '',
            codeSnippet: data.code_snippet,
            expectedOutput: data.expected_output,
            explanation: data.explanation,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'bot', content: data.message || data.error || 'An error occurred while fetching data.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Something Went Wrong...Please try again later.' }]);
    } finally {
      setIsFetching(false);
      setQuery('');
    }
  };

  return (
    <div className='mx-auto w-full h-full bg-feature-bg bg-center bg-no-repeat z-20 overflow-hidden'>
      <h1 className='font-bold text-center text-5xl my-6 text-black mx-auto'>Data Insights Code Generator</h1>
            <h4 className='py-3 text-center text-xl font-medium'>ML & Statistical Analysis Code Snippet with Explanation</h4>
            <p className='py-2 text-center text-xl font-medium'>This tool is a simple tool that allows you to generate any Machine Learning(ML) Algorithm or any Statistical Analysis Code snippet based on your prompts for your Data Insights Task</p>

      <div className='sm:chat_container px-2 my-2'>
        <div className='sm:chat_box' ref={chatParent}>
          {messages.map((message, index) => (
            <div key={index} className={`sm:my-1 sm:px-2 sm:gap-1 flex flex-col`} ref={index === messages.length - 1 ? lastMessageRef : null}>
              <div className='flex gap-2 py-1'>
              {message.role === 'bot' && (
                <>
                <Image 
                      src={botAvatar}
                      alt='avatar'
                      width={34}
                      height={34}
                    />
              
                    <span className='flex font-bold text-center items-center'>Assistant</span>
                    </>
                  )}
              </div>
              
              {message.role === 'bot' && message.codeSnippet && (
                <div className='glassmorphism mb-4 sm:px-4'>
                  <div className='sm:code-section my-6 gap-6 '>
                    <strong>Code Snippet:</strong>
                    <pre className='code-box h-full w-50% break-words sm:w-full'>
                      <span className='copy_btn self-end' onClick={() => handleCopy(message.codeSnippet)}>
                        <Image
                          src={copied === message.codeSnippet ? '/assets/icons/tick.svg' : '/assets/icons/copy2.svg'}
                          alt='copy'
                          width={16}
                          height={16}
                        />
                      </span>
                      {message.codeSnippet}
                    </pre>
                  </div>
                  <div className='md:code-section'>
                    <strong>Expected Output:</strong>
                    <pre className='code-box h-full w-50% break-words md:w-full'>{message.expectedOutput}</pre>
                  </div>
                  <div className='md:text-section my-6 gap-6'>
                    <strong>Explanation:</strong>
                    <ReactMarkdown>{message.explanation}</ReactMarkdown>
                  </div>
                  {message.role === 'bot' && (
                    <span className='copy_btn' onClick={() => handleCopy(message.explanation)}>
                      <Image
                        src={copied === message.explanation ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
                        alt='copy'
                        width={16}
                        height={16}
                      />
                    </span>
                  )}
                </div>
              )}
              {message.role === 'user' && (
                <div className='self-end flex gap-3 shadow-sm'>
                  <p className='bg-blue-500 text-white font-medium text-md w-full px-5 rounded-2xl py-2 md:py-4 break-words break-all transition-all justify-center md:mx-5 flex-wrap text-wrap flex-shrink'>{message.content}</p>
                  <SignedIn>
                      <div className='items-end mx-auto'>
                        <UserButton afterSignOutUrl='/' />
                      </div>
                    </SignedIn>
                </div>
              )}
              {message.role === 'bot' && !message.codeSnippet && (
                <div className='sm:glassmorphism sm:px-4 mb-4'>{message.content}</div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)} className='flex w-full mx-auto sticky bottom-20 md:mt-40 bg-feature-bg bg-center bg-no-repeat'>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            name="prompt"
            className="rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all w-full px-2 outline-none cursor-text "
            placeholder='Enter your Query here'
          />
          <button type="submit" className='text-md font-semibold rounded-md items-center mx-auto glassmorphism gap-3 cursor-pointer'>
            {isFetching ? <Image src={loader} alt='loader' width={24} height={24} /> : <Image src={send} alt='send' width={24} height={24} />}
          </button>
        </form>
      </div>
    </div>
  );
}
