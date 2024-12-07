'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import DOMPurify from 'dompurify';
import Confetti from 'react-confetti';

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

const DifficultySelectionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  // const difficulty = searchParams?.get('difficulty') ?? 'easy'; 
  const timeLimit = parseInt(searchParams?.get('time') || '120', 10);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const params = useParams();
  const sibling = params?.sibling as Sibling | undefined;

  // const sibling = params?.sibling;
  const difficulty = params?.difficulty;

  const [audio] = useState(typeof Audio !== 'undefined' ? new Audio('/sounds/retro-game-arcade-short-236130.mp3') : null);

  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const decodeHtmlEntities = (str: string): string => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };
  

  // Fetch questions based on difficulty
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions?difficulty=${difficulty}`);
      if (response.ok) {
        const data: Question[] = await response.json();
        setQuestions(data);
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Fetch data when difficulty changes
  useEffect(() => {
    fetchQuestions();
  }, [difficulty]);

  useEffect(() => {
    if (musicPlaying && audio) {
      audio.loop = true;
      audio.play();
    } else if (audio) {
      audio.pause();
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [musicPlaying, audio]);

  useEffect(() => {
    if (confettiActive) {
      const timer = setTimeout(() => {
        setConfettiActive(false);
      }, 10000); // Confetti will be active for 10 seconds

      return () => clearTimeout(timer);
    }
  }, [confettiActive]);

  const siblingInfo = {
    tony: { age: 20, favoriteActivity: 'Gaming', avatar: '/images/tony.jpg' },
    abby: { age: 17, favoriteActivity: 'Reading', avatar: '/images/abby.jpg' },
    andy: { age: 13, favoriteActivity: 'Drawing', avatar: '/images/andy.jpg' },
  };

  let currentAudio: HTMLAudioElement | null = null;

  const playSound = (isCorrect: boolean) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const sound = new Audio(isCorrect ? '/sounds/retro-game-arcade-short-236130.mp3' : '/sounds/panic-182769.mp3');
    currentAudio = sound;
    sound.play();

    setTimeout(() => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }, 5000);
  };

  const playCelebratorySound = () => {
    const celebrationAudio = new Audio('/sounds/level-vii-short-258782.mp3');
    celebrationAudio.play();
    setTimeout(() => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }, 10000);
  };


  // const fetchData = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/api/questions?difficulty=${difficulty}");
  //     if (!res.ok) {
  //       throw new Error("Failed to fetch data from the API");
  //     }
  //     const data: Question[] = await res.json();
  
  //     // Decode the question and answers for each question
  //     const decodedQuestions = data.map((q) => ({
  //       ...q,
  //       question: decodeHtmlEntities(q.question),
  //       correct_answer: decodeHtmlEntities(q.correct_answer),
  //       incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
  //     }));
  
  //     console.log(decodedQuestions); // Verify structure of the data
  //     setQuestions(decodedQuestions);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setQuestions([]); // Reset questions to an empty array
  //   } finally {
  //     setLoading(false); // Stop loading regardless of success or failure
  //   }
  // };
  
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/questions?difficulty=${difficulty}");
      if (!res.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      const data: Question[] = await res.json();
  
      // Decode the question and answers for each question
      const decodedQuestions = data.map((q) => ({
        ...q,
        question: decodeHtmlEntities(q.question),
        correct_answer: decodeHtmlEntities(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
      }));
  
      console.log(decodedQuestions); // Verify structure of the data
      setQuestions(decodedQuestions);
    } catch (error) {
      console.error("Error fetching data:", error);
      setQuestions([]); // Reset questions to an empty array
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData();

    if (!sibling || !isValidSibling(sibling)) {
      router.push('/');
    }
  }, [difficulty, sibling, router]);

  const handleSubmit = () => {
    if (!questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer.toLowerCase() === currentQuestion.correct_answer.toLowerCase();

    setFeedback(isCorrect ? 'Correct!' : `Wrong! Correct answer: ${currentQuestion.correct_answer}`);

    if (isCorrect) {
      setScore(score + 1);
      playSound(true);
    } else {
      playSound(false);
    }

    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestion);
        setUserAnswer('');
        setFeedback(null);
      }, 3000);
    } else {
      setTimeout(() => {
        playCelebratorySound();
        setConfettiActive(true);
        setShowScore(true);
      }, 5000);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showScore) {
      setShowScore(true);
    }
  }, [timeLeft, showScore]);

  if (!sibling || !isValidSibling(sibling)) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <nav className="bg-indigo-800 p-5 w-full fixed top-0 left-0 z-10">
        <ul className="flex justify-between items-center z-10 relative">
          <li><a href="/" className="p-3 text-white text-lg font-bold">Home</a></li>
          <li><p className="text-2xl font-bold text-white">Trivia Duel</p></li>
          <li><span className="p-3 text-white text-lg font-semibold">Score: {score}</span></li>
        </ul>
      </nav>

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
        <p className='text-white font-bold'>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className='text-white'>No questions available</p>
      ) : (
        <>
          {showScore ? (
            <div className="text-center">
              <h2 className="mt-4 text-white font-bold">Game Over</h2>
              <h2 className="mt-4 text-white font-bold">Your score is {score}/{questions.length}</h2>
              <button
                onClick={() => router.push('/game/${sibling}/difficulty/${difficulty}?time=${numericTime}`') }
                className="mt-6 px-8 mx-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/game/${sibling}/settings')}
                className="mt-6 px-6 mx-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-600"
              >
                Change Settings
              </button>
            </div>
          ) : (
            <div className="mt-2 text-white text-lg text-bold font-bold">
              <p className="text-white mb-4">Difficulty: {difficulty}</p>
              <p>Time remaining: {timeLeft}s</p>
              {/* <p>Time remaining: {timeLeft}s</p> */}
              <p className="text-white">{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</p>
              <div className="mt-0">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(questions[currentQuestionIndex]?.question || ''),
                  }}
                  className="text-white px-0 p-2 text-semibold text-lg"
                />
                <ul className="list-disc list-inside">
                  {[questions[currentQuestionIndex].correct_answer, ...questions[currentQuestionIndex].incorrect_answers].map((option, index) => (
                    <li key={index} className="text-white">{`${index + 1}. ${option}`}</li>
                  ))}
                </ul>
              </div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here"
                // className="mt-2 p-2 border rounded-lg text-white"
                className="mt-0 mx-2 px-40 p-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
              {feedback && (
                <div
                    className={`mt-0 text-center p-2 ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {feedback}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className={`mt-0 mx-2 px-10 py-2 bg-indigo-600 text-white rounded-lg ${!userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 '}`}
              >
                Submit
              </button>
              {/* {feedback && <p className="mt-4 text-lg text-white">{feedback}</p>} */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DifficultySelectionPage;
