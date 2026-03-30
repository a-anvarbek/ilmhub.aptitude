import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { QuizMascot } from "./components/QuizMascot";
import { ProgressBar } from "./components/ProgressBar";
import { QuizCard } from "./components/QuizCard";
import { YesNoButton } from "./components/YesNoButton";
import { ResultScreen } from "./components/ResultScreen";
import { FloatingClouds } from "./components/FloatingClouds";

import BG from "../assets/SecondaryTestPageImage.png";
import type { BinaryQuestion } from "../components/BinaryQuestion";
import { telegram } from "../services/telegram";
import { sendAttemptToTelegram } from "../services/telegramBotService";

type TestState = {
  studentName: string;
  parentPhone: string;
  grade: number;
  branch: string;
};

export function SecondaryTestPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TestState | null;

  const [questions, setQuestions] = useState<BinaryQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [name, setName] = useState("");
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>(
    {},
  );
  const [score, setScore] = useState(0);
  const [mascotMood, setMascotMood] = useState<
    "happy" | "excited" | "thinking"
  >("thinking");

  useEffect(() => {
    if (!state) {
      navigate("/test", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    (async () => {
      const isMini = await telegram.isMiniApp();
      setIsTelegram(isMini);

      if (isMini) {
        const u = (await telegram.getUser()) as any;
        setName(u?.first_name ?? u?.last_name ?? u?.username ?? "");
      }
    })();

    const culture =
      localStorage.getItem("blazor.culture") ?? i18n.language ?? "uz-Latn";

    const file = `/data/test-new.${culture}.json`;

    fetch(file)
      .then((r) => r.json())
      .then((rawData: any[]) => {
        const data: BinaryQuestion[] = rawData.map((item) => ({
          Statement: item.Statement ?? item.statement ?? "",
          Category: item.Category ?? item.category ?? "",
        }));

        const shuffled = data.sort(() => Math.random() - 0.5);

        setQuestions(shuffled);

        const cats: Record<string, number> = {};
        shuffled.forEach((q) => {
          if (q.Category) cats[q.Category] = 0;
        });

        setCategoryScores(cats);
      })
      .catch((err) => console.error("Loading error:", err));
  }, [i18n.language]);

  const currentQuestion = questions[index];

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answerIndex);

    const isYes = answerIndex === 0;

    if (isYes) setScore((prev) => prev + 1);

    setMascotMood(isYes ? "happy" : "thinking");

    const category = currentQuestion?.Category;

    if (!category) return;

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const timestamp = Math.floor(Date.now() / 1000);

    const storageKey = `${slugify(state?.studentName || "")}:${
      state?.parentPhone
    }:${state?.grade}:${slugify(state?.branch || "")}:${timestamp}`;

    const nextCategoryScores = {
      ...categoryScores,
      [category]: (categoryScores[category] ?? 0) + (isYes ? 1 : 0),
    };

    setCategoryScores(nextCategoryScores);

    setTimeout(() => {
      const nextIndex = index + 1;

      if (nextIndex < questions.length) {
        setIndex(nextIndex);
        setSelectedAnswer(null);
        setMascotMood("thinking");
      } else {
        setShowResult(true);

        confetti({
          particleCount: 120,
          spread: 70,
        });

        const attemptData = {
          storageKey,
          name: state?.studentName,
          phone: state?.parentPhone,
          grade: state?.grade,
          filial: state?.branch,
          categoryScores: nextCategoryScores,
        };

        sendAttemptToTelegram(attemptData).catch((err) => {
          console.error("Failed to send attempt to Telegram:", err);
        });

        const payload = encodeURIComponent(
          btoa(unescape(encodeURIComponent(JSON.stringify(attemptData)))),
        );
        setTimeout(() => {
          navigate(`/result/${payload}`);
        }, 1500);
      }
    }, 600);
  };

  if (!currentQuestion) return null;

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-6xl"
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⭐
        </motion.div>
      </div>

      <FloatingClouds />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl">
        <QuizMascot mood={mascotMood} />

        <ProgressBar current={index + 1} total={questions.length} />

        <AnimatePresence mode="wait">
          {!showResult ? (
            <QuizCard key={index} question={currentQuestion.Statement}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <ResultScreen
              score={score}
              total={questions.length}
              onRestart={() => {
                setIndex(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
                setMascotMood("thinking");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
