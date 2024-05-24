'use client'
import { useState } from 'react';
import loader from "@/public/assets/icons/loader.svg"
import Image from 'next/image';
export default function Home() {
    const [query, setQuery] = useState('');
    const [code, setCode] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [explanation, setExplanation] = useState('');
    const [error, setError] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [copied, setCopied] = useState('');

  const handleCopy = () => {
    setCopied(code);
    navigator.clipboard.writeText(code);
    setTimeout(() => {
      setCopied('');
    }, 3000);
  };

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFetching(true)
        try {
            const res = await fetch('https://data-analysis-toolbot.onrender.com/data-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text_input: query })
            });
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            console.log(data)
            if (data.code_snippet) {
                setCode(data.code_snippet);
                setExpectedOutput(data.expected_output);
                setExplanation(data.explanation);
                setError('');
            } else {
                setError(data.error);
                setCode('');
                setExpectedOutput('');
                setExplanation('');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data. Please try again.');
        }finally {
            setIsFetching(false); // Reset loading state
        }
    };

    const handleKeyDown = (e : any)=>{
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
      }

  
    return (
        <div className='mx-auto w-full h-full bg-feature-bg bg-center bg-no-repeat'>
            <h1 className='font-bold text-center text-5xl my-6 text-black mx-auto'>Welcome To Data Analysis ToolBot</h1>
            <h4 className='py-3 text-center text-xl font-medium'>Here you can find your complete solution by using different Data Analysis Tabs for your project</h4>
            <p className='py-2 text-center text-xl font-medium'>In this data analysis tab, you can generate any Pandas or Numpy Code snippet based on your prompts for your Data Analysis projects</p>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-5 mx-auto my-5' onKeyDown={handleKeyDown}>
             

                <textarea value={query} onChange={(e) => setQuery(e.target.value)} className="py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all border border-slate-500" placeholder='Enter your Query here'         
                />

                <button className='bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-red-500 py-2 px-4 w-fit items-center mx-auto'>Generate Code snippet</button>
            </form>
           
            
            {/* Display results or loader */}
            <div className='my-10 flex flex-col justify-center items-center mx-auto'>
                {isFetching ? (
                    <Image src={loader} alt='loader' className='object-contain' width={80} height={80} />
                ) : error ? (
                <p className='text-red-500 text-xl font-medium my-2 py-2 glassmorphism'>
                {error}
                 </p>
            ) : code && (
                    <div className='mx-auto py-2 flex flex-col justify-center gap-5 glassmorphism'>
                        <h3 className='font-semibold text-2xl text-blue-600'>Code snippet Generated Successfully..Here is your code below:</h3>
                        <span className='copy_btn' onClick={handleCopy}>
          <Image
            src={copied === code ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
            alt='copy'
            className='dark:w-13 dark:h-13 dark:font-semibold shadow-lg'
            width={16}
            height={16}
          />
        </span>
                        <pre className='sm:text-xl'><code lang='python'>{code}</code></pre>
                        <h3 className='font-semibold text-2xl text-blue-600'>Expected Output of this Code snippet:</h3>
                        <pre className='sm:text-xl'>{expectedOutput}</pre>
                        <h3 className='font-semibold text-2xl text-blue-600'>Explanation of this Code snippet:</h3>
                        <pre className='sm:text-xl'>{explanation}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
