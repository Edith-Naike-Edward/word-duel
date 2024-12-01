"use client";

import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

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
    }

    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestion);
        setUserAnswer(""); // Clear user answer
        setFeedback(null); // Clear feedback
      }, 2000); // Delay for feedback display
    } else {
      setTimeout(() => setShowScore(true), 2000);
    }
  };

  // Return null early if sibling is invalid
  if (!sibling || !isValidSibling(sibling)) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <p>Loading questions...</p>
        ) : questions.length === 0 ? (
            <p>No questions available</p>
        ) : (
        <>
          <h1 className="text-4xl font-bold">Game for {sibling.charAt(0).toUpperCase() + sibling.slice(1)}</h1>
          {showScore ? (
            <h2 className="mt-4">Your score is {score}/{questions.length}</h2>
          ) : (
            <div className="mt-4">
              <p>{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</p>
              <h2
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(questions[currentQuestionIndex]?.question || '') }}
              />
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here"
                className="mt-2 p-2 border rounded-lg"
              />
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg ${!userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                Submit
              </button>
              {feedback && <p className="mt-4 text-lg">{feedback}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
