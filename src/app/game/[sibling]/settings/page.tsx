'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Sibling = 'tony' | 'abby' | 'andy';

const isValidSibling = (sibling: string): sibling is Sibling =>
  ['tony', 'abby', 'andy'].includes(sibling);

const DifficultySelectionPage = () => {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('easy');
  const [time, setTime] = useState(60); // Set default time to 60 seconds
  const params = useParams();
  const sibling = params?.sibling as Sibling | undefined;
  const [inputValue, setInputValue] = useState('60'); // String value for user input
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartGame = () => {
    const numericTime = Number(inputValue);
  
    if (!sibling || !isValidSibling(sibling)) {
      setErrorMessage('Invalid sibling. Please try again.');
      return;
    }
  
    if (numericTime >= 30 && numericTime <= 120) {
      router.push(`/game/${sibling}/difficulty/${difficulty}?time=${numericTime}`);
    } else {
      setErrorMessage('Please set a valid time between 30 and 120 seconds.');
    }
  };
  

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update input value directly

    // Validate the input as a number within range
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 30 && numericValue <= 120) {
      setErrorMessage('');
      setTime(numericValue); // Update `time` only if valid
    } else {
      setErrorMessage('Time must be between 30 and 120 seconds.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-6">Select Game Options</h1>

      <div className="flex flex-col items-center w-80">
        <label htmlFor="difficulty" className="text-white mb-2">
          Select Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded-md"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label htmlFor="time" className="text-white mb-2">
          Set Time (seconds):
        </label>
        <input
          id="time"
          type="text"
          value={inputValue}
          onChange={handleTimeChange}
          className={`w-full p-2 mb-4 text-white bg-gray-800 border ${
            errorMessage ? 'border-red-500' : 'border-gray-700'
          } rounded-md`}
          placeholder="Enter time in seconds (30-120)"
        />
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <button
          onClick={handleStartGame}
          className="w-full px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default DifficultySelectionPage;
