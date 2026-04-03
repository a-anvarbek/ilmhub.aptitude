import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { Star, Rainbow, Balloon, Palette } from "lucide-react";
import { QuizMascot } from "./components/QuizMascot";
import { ProgressBar } from "./components/ProgressBar";
import { QuizCard } from "./components/QuizCard";
import { YesNoButton } from "./components/YesNoButton";
import { ResultScreen } from "./components/ResultScreen";
import { FloatingClouds } from "./components/FloatingClouds";
import { sendAttemptToTelegram } from "../services/telegramBotService";

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
  { id: 1, question: "Narsalarni ochib ko‘rishni yoqtirasanmi?" },
  { id: 2, question: "Robot yoki o‘yinchoq yasashni xohlaysanmi?" },
  { id: 3, question: "Hisoblashni yoqtirasanmi?" },
  { id: 4, question: "Telefon yoki kompyuterda yangi narsalarni o‘rganishni yoqtirasanmi?" },
  { id: 5, question: "Narsalar qanday ishlashini bilishni xohlaysanmi?" },

  { id: 6, question: "Rasm chizishni yoqtirasanmi?" },
  { id: 7, question: "Qo‘shiq aytish yoki sahnaga chiqishni yoqtirasanmi?" },
  { id: 8, question: "Chiroyli narsalar yasashni yoqtirasanmi?" },
  { id: 9, question: "Hikoya o‘ylab topishni yoqtirasanmi?" },
  { id: 10, question: "Ranglar bilan ishlashni yoqtirasanmi?" },

  { id: 11, question: "Hayvonlarni yaxshi ko‘rasanmi?" },
  { id: 12, question: "Gul ekish yoki o‘simlik parvarish qilishni yoqtirasanmi?" },
  { id: 13, question: "Tabiatda sayr qilishni yoqtirasanmi?" },
  { id: 14, question: "Hayvonlar haqida video ko‘rishni yoqtirasanmi?" },
  { id: 15, question: "Tajriba qilish (masalan suv bilan o‘yinlar) yoqadimi?" }
];


export function PrimaryTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TestState | null;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mascotMood, setMascotMood] = useState<"happy" | "excited" | "thinking">("thinking");

  useEffect(() => {
    document.body.style.fontFamily = "'Fredoka', sans-serif";
  }, []);

  if (!state) {
    navigate("/test", { replace: true });
    return null;
  }

  const { studentName, grade, branch } = state;

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    const isYes = index === 0;

    if (isYes) setScore((prev) => prev + 1);

    setMascotMood(isYes ? "happy" : "thinking");

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setMascotMood("thinking");
      } else {
        setShowResult(true);

        const categoryScores = {
          tech: Math.floor(Math.random() * 10) + 1,
          art: Math.floor(Math.random() * 10) + 1,
          science: Math.floor(Math.random() * 10) + 1,
          nature: Math.floor(Math.random() * 10) + 1,
        };

        const payloadData = {
          name: studentName,
          phone: state.parentPhone,
          grade,
          filial: state.branch,
          categoryScores,
        };

        sendAttemptToTelegram(payloadData).catch((err) => {
          console.error("Failed to send attempt to Telegram:", err);
        });

        const encoded = encodeURIComponent(
          btoa(unescape(encodeURIComponent(JSON.stringify(payloadData))))
        );

        setTimeout(() => {
          navigate(`/result/${encoded}`);
        }, 1200);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 via-teal-300 to-indigo-300 flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-24 h-24"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Star className="w-full h-full text-emerald-500" />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 w-20 h-20"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Rainbow className="w-full h-full text-teal-500" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-20 w-20 h-20"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Balloon className="w-full h-full text-indigo-500" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-32 w-24 h-24"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <Palette className="w-full h-full text-teal-600" />
        </motion.div>
      </div>

      {/* Background effects */}
      <FloatingClouds />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-4xl">
        
        <h1 className="text-2xl font-bold text-center text-[var(--foreground)]">
          {studentName} | {grade}-sinf | {branch}
        </h1>

        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <QuizMascot mood={mascotMood} />
        </motion.div>

        {!showResult && (
          <ProgressBar current={currentQuestion + 1} total={quizQuestions.length} />
        )}

        <AnimatePresence mode="wait">
          {!showResult ? (
            <QuizCard
              key={currentQuestion}
              question={quizQuestions[currentQuestion].question}
              onSoundClick={() => {}}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <YesNoButton
                  type="yes"
                  onClick={() => handleAnswerClick(0)}
                  disabled={selectedAnswer !== null}
                  state={
                    selectedAnswer === null
                      ? "default"
                      : selectedAnswer === 0
                      ? "correct"
                      : "default"
                  }
                />
                <YesNoButton
                  type="no"
                  onClick={() => handleAnswerClick(1)}
                  disabled={selectedAnswer !== null}
                  state={
                    selectedAnswer === null
                      ? "default"
                      : selectedAnswer === 1
                      ? "correct"
                      : "default"
                  }
                />
              </div>
            </QuizCard>
          ) : (
            <div className="bg-[var(--card)] text-[var(--card-foreground)] p-6 rounded-[var(--radius)] shadow-lg">
              <ResultScreen
                score={score}
                total={quizQuestions.length}
                onRestart={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setMascotMood("thinking");
                }}
              />
            </div>
          )}
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
