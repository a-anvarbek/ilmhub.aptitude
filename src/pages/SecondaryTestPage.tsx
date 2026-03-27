import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { ProgressBar } from "./components/ProgressBar";
import { FloatingClouds } from "./components/FloatingClouds";
import BinaryQuestionComponent from "../components/BinaryQuestion";

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
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>(
    {},
  );
  const [isTelegram, setIsTelegram] = useState(false);

  // redirect agar state bo‘lmasa
  useEffect(() => {
    if (!state) {
      navigate("/test", { replace: true });
    }
  }, [state, navigate]);

  // data yuklash
  useEffect(() => {
    (async () => {
      const isMini = await telegram.isMiniApp();
      setIsTelegram(isMini);
    })();

    const culture =
      localStorage.getItem("blazor.culture") ?? i18n.language ?? "uz-Latn";

    fetch(`/data/test-new.${culture}.json`)
      .then((r) => r.json())
      .then((rawData: any[]) => {
        const data: BinaryQuestion[] = rawData.map((item) => ({
          Statement: item.Statement ?? item.statement ?? "",
          Category: item.Category ?? item.category ?? "",
        }));

        // shuffle
        const shuffled = data.sort(() => Math.random() - 0.5);

        setQuestions(shuffled);

        // category init
        const cats: Record<string, number> = {};
        shuffled.forEach((q) => {
          if (q.Category) cats[q.Category] = 0;
        });

        setCategoryScores(cats);
      })
      .catch((err) => console.error("Error loading test:", err));
  }, [i18n.language]);

  const handleSelected = async (result: { yes: boolean; category: string }) => {
    const updatedScores = {
      ...categoryScores,
      [result.category]:
        (categoryScores[result.category] || 0) + (result.yes ? 1 : 0),
    };

    setCategoryScores(updatedScores);

    const nextIndex = index + 1;

    // quiz tugadi
    if (nextIndex >= questions.length) {
      const attemptData = {
        name: state?.studentName,
        phone: state?.parentPhone,
        grade: state?.grade,
        filial: state?.branch,
        categoryScores: updatedScores,
      };

      try {
        await sendAttemptToTelegram(attemptData);
      } catch (e) {
        console.warn("Telegramga yuborilmadi", e);
      }

      const payload = encodeURIComponent(
        btoa(unescape(encodeURIComponent(JSON.stringify(attemptData)))),
      );

      navigate(`/result/${payload}`);
      return;
    }

    setIndex(nextIndex);
  };

  const currentQuestion = questions[index];

  const progress = questions.length
    ? Math.round((index / questions.length) * 100)
    : 0;

  if (!currentQuestion) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <FloatingClouds />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-3xl">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <BinaryQuestionComponent
            question={currentQuestion}
            onSelected={handleSelected}
          />
        </motion.div>

        <ProgressBar current={index + 1} total={questions.length} />
      </div>

      {/* floating bubbles */}
      {[...Array(5)].map((_, i) => (
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
