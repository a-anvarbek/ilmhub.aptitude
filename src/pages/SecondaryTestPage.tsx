import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";

import { QuizMascot } from "./components/QuizMascot";
import { ProgressBar } from "./components/ProgressBar";
import { QuizCard } from "./components/QuizCard";
import { YesNoButton } from "./components/YesNoButton";
import { FloatingClouds } from "./components/FloatingClouds";

import BG from "../assets/SecondaryTestPageImage.png";

type TestState = {
  studentName: string;
  parentPhone: string;
  grade: number;
  branch: string;
};

interface Question {
  id: number;
  question: string;
}

const quizQuestions: Question[] = [
  { id: 1, question: "2 + 2 = ?" },
  { id: 2, question: "Quyosh qanday? ☀️" },
  { id: 3, question: "Mushuk nima deydi? 🐱" },
  { id: 4, question: "Baliq qayerda yashaydi? 🐟" },
];

export function SecondaryTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TestState | null;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult] = useState(false);
  const [mascotMood, setMascotMood] = useState<
    "happy" | "excited" | "thinking"
  >("thinking");

  useEffect(() => {
    document.body.style.fontFamily = "'Fredoka', sans-serif";
  }, []);

  if (!state) {
    navigate("/test", { replace: true });
    return null;
  }

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    setScore(score + 1);
    setMascotMood("excited");

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF8C00", "#00CED1", "#32CD32"],
    });

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setMascotMood("thinking");
      } else {
        const payload = {
          name: state.studentName,
          phone: state.parentPhone,
          grade: state.grade,
          categoryScores: {
            playful: score + 1,
            creative: Math.floor(Math.random() * 10) + 1,
            smart: Math.floor(Math.random() * 10) + 1,
            active: Math.floor(Math.random() * 10) + 1,
          },
        };

        const encoded = btoa(JSON.stringify(payload));
        navigate(`/result/${encoded}`);
      }
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden relative"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {" "}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-6xl"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-5xl"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌈
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20 text-5xl"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          🎈
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-32 text-6xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          🎨
        </motion.div>
      </div>
      <FloatingClouds />
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <QuizMascot mood={mascotMood} />
        </motion.div>

        {!showResult && (
          <ProgressBar
            current={currentQuestion + 1}
            total={quizQuestions.length}
          />
        )}

        <AnimatePresence mode="wait">
          {!showResult ? (
            <QuizCard
              key={currentQuestion}
              question={quizQuestions[currentQuestion].question}
              onSoundClick={() => {}}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <YesNoButton
                  type="yes"
                  onClick={() => handleAnswerClick(0)}
                  disabled={selectedAnswer !== null}
                  state="default"
                />
                <YesNoButton
                  type="no"
                  onClick={() => handleAnswerClick(1)}
                  disabled={selectedAnswer !== null}
                  state="default"
                />
              </div>
            </QuizCard>
          ) : null}
        </AnimatePresence>
      </div>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 md:w-24 md:h-24 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
