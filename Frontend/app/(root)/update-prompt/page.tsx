// 'use client'
// import React, { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import Form from '@/components/shared/Form'

// const EditPrompt = () => {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const promptId = searchParams.get('id')
//     const [submitted, setSubmitted] = useState(false)
//     const [post, setPost] = useState({
//         prompt:'',
//         tag:''
//     })
    

//     useEffect(() =>{
//          const getPromptDetails = async () =>{
//             const response = await fetch(`/api/prompt/${promptId}`)
//             const data = await response.json()

//             setPost({
//                 prompt:data.prompt,
//                 tag:data.tag
//             })
//          }

//          if (promptId) getPromptDetails()
//     },[promptId])

//  const handleEditPrompt = async(e:React.FormEvent<HTMLFormElement>)=>{
//        e.preventDefault();
//        setSubmitted(true)

//        if(!promptId) return alert("Sorry,this Prompt id is not found!")

//        try {
        
//         const response = await fetch(`/api/prompt/${promptId}`,{
//             method:'PATCH',
//             body: JSON.stringify({
//                 prompt:post.prompt,
//                 tag:post.tag
//             })
//         })

//         if(response.ok){
//             router.push('/');
//         }

//        } catch (error) {
//         console.log(error)
//        } finally{
//          setSubmitted(false)
//        }
//  }


//   return (
//     <Form 
//       type='Edit'
//       post={post}
//       setPost={setPost}
//       submitted={submitted}
//       handleSubmit={handleEditPrompt}
    
//     />
//   )
// }

// export default EditPrompt