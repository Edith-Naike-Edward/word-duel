// pages/select-difficulty.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const DifficultySelectionPage = () => {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('easy');
  const [time, setTime] = useState(60); // Set default time to 60 seconds

  const handleStartGame = () => {
    // Pass selected options to the game page, e.g., via query parameters
    router.push(`/game?difficulty=${difficulty}&time=${time}`);
  };

//   const { query } = useRouter();
//   const difficulty = query.difficulty || 'easy';
//   const time = query.time || 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Select Difficulty</h1>

      <label htmlFor="difficulty" className="text-white mb-2">Select Difficulty:</label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="p-2 mb-4 text-white bg-gray-800"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <label htmlFor="time" className="text-white mb-2">Set Time (seconds):</label>
      <input
        id="time"
        type="number"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        className="p-2 mb-4 text-white bg-gray-800"
        min="30"
        max="120"
        placeholder="Enter time in seconds"
      />

      <button
        onClick={handleStartGame}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
      >
        Continue Playing
      </button>
    </div>
  );
};

export default DifficultySelectionPage;
