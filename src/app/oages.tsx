"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';  // Import the Head component
import { useRouter } from "next/navigation";

// Types for siblings
type Sibling = 'Tony' | 'Abby' | 'Andy';

type Feedback = {
  message?: string;
  feedback?: string[];
};

export default function WelcomePage() {
  // const [guess, setGuess] = useState('');  // State to store the guess
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  // const [selectedSibling, setSelectedSibling] = useState<Sibling | null>(null);
  const router = useRouter();

  // const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setGuess(e.target.value);
  // };
  
  // const handleGuessSubmit = () => {
  //   if (selectedSibling) {
  //     fetchWord(selectedSibling);
  //   } else {
  //     alert("Please select a sibling first!");
  //   }
  // };  
  
  // const fetchWord = async (sibling: Sibling) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/wordle/${sibling}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ guess }),
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setFeedback(data); // Display feedback in your frontend
  //     } else {
  //       console.error("Failed to fetch word feedback");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching word feedback:", error);
  //   }
  // };
    
  const chooseSibling = (sibling: Sibling) => {
    alert(`You chose ${sibling}!`);
     // Navigate to the respective game page for the sibling
    // router.push(`/game/${sibling}`);
    router.push(`/game/${sibling.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      {/* Add favicon to the head */}
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-5xl font-bold text-gray-800">Word Duel</h1>
      <h2 className="text-2xl text-gray-600 mt-4">Welcome to Word Duel!</h2>
      <p className="text-lg text-gray-500 mt-2 mb-8">Choose your sibling.</p>

      <div className="flex space-x-8">
        {/* Tony */}
        <div
          onClick={() => chooseSibling('Tony')}
          className="flex flex-col items-center cursor-pointer p-4 bg-white rounded-lg shadow-md hover:scale-105 transform transition duration-300"
        >
          <Image src="/images/tony.jpg" alt="Tony" width={150} height={150} />
          <p className="mt-2 text-lg font-medium">Tony</p>
        </div>

        {/* Abby */}
        <div
          onClick={() => chooseSibling('Abby')}
          className="flex flex-col items-center cursor-pointer p-4 bg-white rounded-lg shadow-md hover:scale-105 transform transition duration-300"
        >
          <Image src="/images/abby.jpg" alt="Abby" width={150} height={150} />
          <p className="mt-2 text-lg font-medium">Abby</p>
        </div>

        {/* Andy */}
        <div
          onClick={() => chooseSibling('Andy')}
          className="flex flex-col items-center cursor-pointer p-4 bg-white rounded-lg shadow-md hover:scale-105 transform transition duration-300"
        >
          <Image src="/images/andy.jpg" alt="Andy" width={150} height={150} />
          <p className="mt-2 text-lg font-medium">Andy</p>
        </div>
      </div>

      {feedback && (
        <div>
          <h2>Feedback</h2>
          <p>{feedback.message || feedback.feedback}</p>
        </div>
      )}

    </div>
  );
};

// "use client";

// import { useRouter } from "next/navigation";
// import React from "react";

// // Define sibling type
// type Sibling = "tony" | "abby" | "andy";

// export default function HomePage() {
//   const router = useRouter();

//   // Function to navigate to sibling's game page
//   const chooseSibling = (sibling: Sibling) => {
//     alert(`You chose ${sibling}!`);
//     router.push(`/game/${sibling}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-4xl font-bold text-center">Welcome to the Sibling Word Game!</h1>
//       <p className="text-lg mt-4 text-center">
//         Choose your sibling to start the game.
//       </p>
//       <div className="flex space-x-4 mt-8">
//         {["tony", "abby", "andy"].map((sibling) => (
//           <button
//             key={sibling}
//             onClick={() => chooseSibling(sibling as Sibling)}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             {sibling.charAt(0).toUpperCase() + sibling.slice(1)}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

