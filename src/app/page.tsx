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
  const router = useRouter();
    
  const chooseSibling = (sibling: Sibling) => {
    // alert(`You chose ${sibling}!`);
     // Navigate to the respective game page for the sibling
    // router.push(`/game/${sibling}`);
    router.push(`/game/${sibling.toLowerCase()}`);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-blue-100"
    >
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

      {/* {feedback && (
        <div>
          <h2>Feedback</h2>
          <p>{feedback.message || feedback.feedback}</p>
        </div>
      )} */}

    </div>
  );
};


