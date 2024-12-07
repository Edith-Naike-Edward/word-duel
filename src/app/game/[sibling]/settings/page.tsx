'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import Starfield from '@/app/starfield';


type Sibling = 'Tony' | 'Abby' | 'Andy';

const DifficultySelectionPage = () => {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('easy');
  const [time, setTime] = useState(60); // Set default time to 60 seconds
  const [selectedSibling, setSelectedSibling] = useState<Sibling | null>(null);
  const [inputValue, setInputValue] = useState('60'); // String value for user input
  const [errorMessage, setErrorMessage] = useState('');

  const chooseSibling = (sibling: Sibling) => {
    setSelectedSibling(sibling);
  };

  const handleStartGame = () => {
    const numericTime = Number(inputValue);

    if (!selectedSibling) {
      setErrorMessage('Please select a sibling.');
      return;
    }

    if (numericTime >= 30 && numericTime <= 120) {
      router.push(`/game/${selectedSibling.toLowerCase()}/difficulty/${difficulty}?time=${numericTime}`);
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
      <nav className="bg-indigo-800 p-5 w-full fixed top-0 left-0 z-10">
        {/* <Starfield className="absolute inset-0 z-0" /> Starfield Component */}
        <ul className="flex justify-between items-center z-10 relative">
          <li><a href="/" className="p-3 text-white text-lg font-bold">Home</a></li>
          <li><p className="text-2xl font-bold text-white">Trivia Duel</p></li>
            <li className="flex items-center">
            <Image src="/images/3.png" alt="Settings" width={40} height={70} className="mr-2" />
            {/* <span className="p-3 text-white text-lg font-semibold">Settings</span> */}
            </li>
        </ul>
      </nav>
      {/* <h1 className="text-4xl font-bold text-white mb-6">Select Game Options</h1> */}

      {!selectedSibling && (
        <>
          <Starfield className="absolute inset-0 z-0 " /> 
          {/* Add Starfield Component */}
          <h1 className="text-4xl font-bold text-white z-10">Trivia Duel Settings</h1>
          <h2 className="text-xl text-white mt-4 z-10">Select Game Options</h2>
          <p className="text-lg text-purple-100 mt-2 mb-8 z-10">Choose your sibling to start the game.</p>
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
        </>
      )}

      {selectedSibling && (
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
          <p className="text-lg text-purple-100 mt-2 mb-10 z-10">You're playing as {selectedSibling}.</p>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          <button
            onClick={handleStartGame}
            className="w-full px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default DifficultySelectionPage;
// 'use client';

// import Image from 'next/image';
// import React, { useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';

// type Sibling = 'Tony' | 'Abby' | 'Andy';

// const isValidSibling = (sibling: string): sibling is Sibling =>
//   ['tony', 'abby', 'andy'].includes(sibling);

// const DifficultySelectionPage = () => {
//   const router = useRouter();
//   const [difficulty, setDifficulty] = useState('easy');
//   const [time, setTime] = useState(60); // Set default time to 60 seconds
//   const params = useParams();
//   const sibling = params?.sibling as Sibling | undefined;
//   const [inputValue, setInputValue] = useState('60'); // String value for user input
//   const [errorMessage, setErrorMessage] = useState('');

//   const chooseSibling = (sibling: Sibling) => {
//     // alert(`You chose ${sibling}!`);
//      // Navigate to the respective game page for the sibling
//     // router.push(`/game/${sibling}`);
//     router.push(`/game/${sibling.toLowerCase()}`);
//   };

//   const handleStartGame = () => {
//     const numericTime = Number(inputValue);
  
//     if (!sibling || !isValidSibling(sibling)) {
//       setErrorMessage('Invalid sibling. Please try again.');
//       return;
//     }
  
//     if (numericTime >= 30 && numericTime <= 120) {
//       router.push(`/game/${sibling}/difficulty/${difficulty}?time=${numericTime}`);
//     } else {
//       setErrorMessage('Please set a valid time between 30 and 120 seconds.');
//     }
//   };
  

//   const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInputValue(value); // Update input value directly

//     // Validate the input as a number within range
//     const numericValue = Number(value);
//     if (!isNaN(numericValue) && numericValue >= 30 && numericValue <= 120) {
//       setErrorMessage('');
//       setTime(numericValue); // Update `time` only if valid
//     } else {
//       setErrorMessage('Time must be between 30 and 120 seconds.');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//       <h1 className="text-4xl font-bold text-white mb-6">Select Game Options</h1>

//       <div className="flex flex-col items-center w-80">
//         <label htmlFor="difficulty" className="text-white mb-2">
//           Select Difficulty:
//         </label>
//         <select
//           id="difficulty"
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//           className="w-full p-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded-md"
//         >
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>

//         <label htmlFor="time" className="text-white mb-2">
//           Set Time (seconds):
//         </label>
//         <input
//           id="time"
//           type="text"
//           value={inputValue}
//           onChange={handleTimeChange}
//           className={`w-full p-2 mb-4 text-white bg-gray-800 border ${
//             errorMessage ? 'border-red-500' : 'border-gray-700'
//           } rounded-md`}
//           placeholder="Enter time in seconds (30-120)"
//         />
//         <p className="text-lg text-purple-100 mt-2 mb-10 z-10">Choose your sibling based on your level of difficulty.</p>
//         <div className="flex flex-col items-center justify-center p-6">
//           <div className="flex space-x-8">
//             {/* Tony */}
//             <div
//               onClick={() => chooseSibling('Tony')}
//               className="flex flex-col items-center cursor-pointer p-4 bg-indigo-200 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
//             >
//               <Image src="/images/tony.jpg" alt="Tony" width={150} height={150} />
//               <p className="mt-2 text-lg font-medium">Tony</p>
//             </div>

//             {/* Abby */}
//             <div
//               onClick={() => chooseSibling('Abby')}
//               className="flex flex-col items-center cursor-pointer p-4 bg-indigo-300 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
//             >
//               <Image src="/images/abby.jpg" alt="Abby" width={150} height={150} />
//               <p className="mt-2 text-lg font-medium">Abby</p>
//             </div>

//             {/* Andy */}
//             <div
//               onClick={() => chooseSibling('Andy')}
//               className="flex flex-col items-center cursor-pointer p-4 bg-indigo-400 rounded-lg shadow-md hover:scale-105 transform transition duration-300"
//             >
//               <Image src="/images/andy.jpg" alt="Andy" width={150} height={150} />
//               <p className="mt-2 text-lg font-medium">Andy</p>
//             </div>
//           </div>
//         </div>

//         {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
//         <button
//           onClick={handleStartGame}
//           className="w-full px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
//         >
//           Start Game
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DifficultySelectionPage;
