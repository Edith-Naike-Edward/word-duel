"use client";

// import React, { useEffect, useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Head from 'next/head';  // Import the Head component
import { useRouter } from "next/navigation";
import Starfield from './starfield';


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
      <Starfield className="absolute inset-0 z-0 " /> 
      {/* Add Starfield Component */}
      <h1 className="text-5xl font-bold text-white z-10">Trivia Duel</h1>
      <h2 className="text-2xl text-white mt-4 z-10">Welcome to Trivia Duel!</h2>
      <p className="text-lg text-purple-100 mt-2 mb-8 z-10">Choose your sibling based on your level of difficulty.</p>

      <div className="flex space-x-8">
        {/* Tony */}
        <div
          onClick={() => chooseSibling('Tony')}
          className="flex flex-col items-center cursor-pointer p-4 bg-indigo-200 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
        >
          <Image src="/images/tony.jpg" alt="Tony" width={150} height={150} />
          <p className="mt-2 text-lg font-medium">Tony</p>
        </div>

        {/* Abby */}
        <div
          onClick={() => chooseSibling('Abby')}
          className="flex flex-col items-center cursor-pointer p-4 bg-indigo-300 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
        >
          <Image src="/images/abby.jpg" alt="Abby" width={150} height={150} />
          <p className="mt-2 text-lg font-medium">Abby</p>
        </div>

        {/* Andy */}
        <div
          onClick={() => chooseSibling('Andy')}
          className="flex flex-col items-center cursor-pointer p-4 bg-indigo-400 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
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


