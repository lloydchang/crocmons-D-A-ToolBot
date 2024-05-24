"use client"
import { useState } from 'react';
import loader from "@/public/assets/icons/loader.svg"
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { SingleImageDropzone } from '@/components/shared/UploadFiles';
import { useEdgeStore } from '@/lib/edgestore';

export default function Home() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [uploadFile, setUploadFile] = useState<File>();
    const [error, setError] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const { edgestore } = useEdgeStore();
    const [copied, setCopied] = useState('');

  const handleCopy = () => {
    setCopied(result);
    navigator.clipboard.writeText(result);
    setTimeout(() => {
      setCopied('');
    }, 3000);
  };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFetching(true);

        try {
            const formData = new FormData();
            formData.append('text_input', query);

            // Handle file upload (if applicable)
            if (uploadFile) {
                const uploadResponse = await edgestore.publicImages.upload({file: uploadFile,
                  onProgressChange: (progress) => {
                      // Handle progress change if needed
                      console.log(progress);
                  },
              });
                const imageUrl = uploadResponse.url; // Assuming this is the URL of the uploaded image
                formData.append('uploaded_file', uploadFile, uploadFile.name);
            }

            // Send the FormData object to the backend
            const response = await fetch('https://data-analysis-toolbot.onrender.com/analysis-report', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            setResult(responseData.response || '');
            setError(responseData.error || '');
        } catch (err) {
            console.error(err);
            setError('Failed to process data. Please try again.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleKeyDown = (e : any)=>{
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <div className='mx-auto bg-feature-bg bg-center bg-no-repeat'>
        <h1 className='font-bold text-center text-5xl my-6 text-black mx-auto'>Build your Data Visualization Report</h1>
            <h4 className='py-3 text-center text-xl font-medium'>Here you can build your complete Data Analysis Report for your project</h4>
            <p className='py-2 text-center text-xl font-medium'>Upload your Data Visualization Graph Image here</p>
            {/* Form and input fields */}
            <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-5 mx-auto my-5' onKeyDown={handleKeyDown}>
                {/* Input for text query */}
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Enter your Query here'
                    className="py-3 px-2 rounded-lg hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all border border-slate-500"
                />
                {/* File upload component */}
                <div className='flex flex-col justify-center items-center mx-auto w-full'>
          <SingleImageDropzone
            width={600}
            height={300}
            value={uploadFile}
            dropzoneOptions={{
              maxSize: 1024 * 1024 * 4, // 4MB
            }}
            onChange={(file) => setUploadFile(file)}
          />
        </div>
                {/* Submit button */}
                <button type='submit' className='bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-red-500 py-2 px-4 w-fit items-center mx-auto'>Generate report</button>
            </form>

            {/* Display results or loader */}
            <div className='my-10 flex flex-col justify-center items-center mx-auto'>
                {isFetching ? (
                    <Image src={loader} alt='loader' className='object-contain' width={80} height={80} />
                ) : error ? (
                    <p className='text-red-500 text-xl font-medium my-2 py-2'>
                        {error}
                    </p>
                ) : result && (
                    <div className='mx-auto px-2 py-2 flex flex-col justify-center gap-5 glassmorphism'>
                        <h3 className='font-semibold text-2xl text-blue-600'>Data Analysis Report:</h3>
                        {/* Display result */}
                        <span className='copy_btn' onClick={handleCopy}>
          <Image
            src={copied === result ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
            alt='copy'
            className='dark:w-13 dark:h-13 dark:font-semibold shadow-lg'
            width={16}
            height={16}
          />
        </span>
                        <pre className='sm:text-xl'>{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
