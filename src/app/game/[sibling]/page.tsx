"use client";

import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import Confetti from 'react-confetti';
import Starfield from '../../starfield';

// Define sibling type
type Sibling = 'tony' | 'abby' | 'andy';

type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const isValidSibling = (sibling: string): sibling is Sibling =>
  ['tony', 'abby', 'andy'].includes(sibling);

export default function SiblingGamePage() {
  const router = useRouter();
  const [guess, setGuess] = useState('');  // State to store the guess
  const params = useParams(); // Get dynamic params
  const sibling = params?.sibling as Sibling | undefined;
  const [questions, setQuestions] = useState<Question[]>([]); // Default to an empty array

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (confettiActive) {
      const timer = setTimeout(() => {
        setConfettiActive(false);
      }, 10000); // Confetti will be active for 10 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when confettiActive changes
    }
  }, [confettiActive]);

    // Sibling information (avatars, info)
  const siblingInfo = {
    tony: { age: 20, favoriteActivity: 'Gaming', avatar: '/images/tony.jpg' },
    abby: { age: 17, favoriteActivity: 'Reading', avatar: '/images/abby.jpg' },
    andy: { age: 13, favoriteActivity: 'Drawing', avatar: '/images/andy.jpg' },
  };

  // Declare a variable outside the playSound function to store the current audio
  let currentAudio: HTMLAudioElement | null = null;

  const playSound = (isCorrect: boolean) => {
    // Stop the previous audio if it's still playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset the audio to the start
    }
  
    // Create a new audio object
    const sound = new Audio(isCorrect ? '/sounds/retro-game-arcade-short-236130.mp3' : '/sounds/panic-182769.mp3');
  
    // Set the global audio variable to the newly created sound
    currentAudio = sound;
  
    // Play the sound
    sound.play();
  
    // Stop the sound after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      if (currentAudio) {
        currentAudio.pause(); // Stop the sound
        currentAudio.currentTime = 0; // Reset the audio to the start
      }
    }, 5000); // Stop after 5 seconds
  };

  const playCelebratorySound = () => {
    const celebrationAudio = new Audio('/sounds/level-vii-short-258782.mp3'); // Add your celebratory sound file here
    celebrationAudio.play();
    // Stop the sound after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      if (currentAudio) {
        currentAudio.pause(); // Stop the sound
        currentAudio.currentTime = 0; // Reset the audio to the start
      }
    }, 10000); // Stop after 10 seconds
  };
  
  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const fetchWord = async (sibling: Sibling) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/wordle/${sibling}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guess }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFeedback(data); // Display feedback in your frontend
      } else {
        console.error("Failed to fetch word feedback");
      }
    } catch (error) {
      console.error("Error fetching word feedback:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/questions");
      if (!res.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      const data: Question[] = await res.json();
      console.log(data); // Add a console log to verify the structure of the data
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setQuestions([]); // Reset questions to an empty array
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };
  

  // Fetch data on component mount
  useEffect(() => {
    fetchData();

    // Validate sibling
    if (!sibling || !isValidSibling(sibling)) {
      router.push('/'); // Redirect to the home page if invalid sibling
    }
  }, [sibling, router]);

  const handleSubmit = () => {
    if (!questions.length) return; // Prevent errors if questions are not loaded

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer.toLowerCase() === currentQuestion.correct_answer.toLowerCase();

    setFeedback(isCorrect ? 'Correct!' : `Wrong! Correct answer: ${currentQuestion.correct_answer}`);

    if (isCorrect) {
      setScore(score + 1);
      playSound(true);
    }  else {
      playSound(false);
    }

    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestion);
        setUserAnswer(""); // Clear user answer
        setFeedback(null); // Clear feedback
      }, 3000); // Delay for feedback display
    } else {
      // Play celebratory sound and show confetti
      setTimeout(() => {
        playCelebratorySound();
        setConfettiActive(true); // Activate confetti
        setShowScore(true);
      }, 5000); // Delay for final sound and confetti
    }
  };

  // Return null early if sibling is invalid
  if (!sibling || !isValidSibling(sibling)) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <nav className="bg-indigo-800 p-5 w-full fixed top-0 left-0 z-10">
        {/* <Starfield className="absolute inset-0 z-0" /> Starfield Component */}
        <ul className="flex justify-between items-center z-10 relative">
          <li><a href="/" className="p-3 text-white text-lg font-bold">Home</a></li>
          <li><p className="text-2xl font-bold text-white">Trivia Duel</p></li>
          <li><span className="p-3 text-white text-lg font-semibold">Score: {score}</span></li>
        </ul>
      </nav>

      {/* <Starfield className="absolute inset-0 z-0" /> Add Starfield Component */}

      {/* Confetti */}
      {confettiActive && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="z-10 pb-6 flex items-center justify-center">
        <img src={siblingInfo[sibling].avatar} alt={`${sibling} avatar`} className="w-32 h-32 rounded-full" />
        <div className="ml-6 text-white">
          <h1 className="text-4xl font-bold text-white">{`Game for ${sibling.charAt(0).toUpperCase() + sibling.slice(1)}`}</h1>
          <div className="mt-2">
            <p><strong>Age:</strong> {siblingInfo[sibling].age}</p>
            <p><strong>Favorite Activity:</strong> {siblingInfo[sibling].favoriteActivity}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading questions...</p>
        ) : questions.length === 0 ? (
            <p>No questions available</p>
        ) : (
        <>
          {/* <h1 className="text-4xl font-bold">Game for {sibling.charAt(0).toUpperCase() + sibling.slice(1)}</h1> */}
          {showScore ? (
              <div className="text-center">
              <h2 className="mt-4 text-white font-bold">Your score is {score}/{questions.length}</h2>
              <button
                onClick={() => router.push('/')}  // Navigate to the home page or a different page
                className="mt-6 px-8 mx-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/game/[sibling]/difficultypage')}  // Navigate to the select difficulty page
                className="mt-6 px-6 mx-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
              >
                Change Settings
              </button>
            </div>
          
          ) : (
            <div className="mt-4 text-white text-lg text-bold font-bold">
              <p>{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</p>
              <h2
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(questions[currentQuestionIndex]?.question || '') }}
                className="text-white px-0 p-2 text-semibold text-lg"
              />
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here"
                // className="mt-2 p-2 border rounded-lg text-white"
                className="mt-4 mx-2 px-40 p-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className={`mt-6 mx-2 px-10 py-2 bg-indigo-600 text-white rounded-lg ${!userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 '}`}
              >
                Submit
              </button>
              {feedback && <p className="mt-4 text-lg text-white">{feedback}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
