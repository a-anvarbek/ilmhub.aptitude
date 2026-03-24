import { useLocation, useNavigate } from "react-router-dom";

type TestState = {
  studentName: string;
  parentPhone: string;
  grade: number;
  branch: string;
};

export function SecondaryTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TestState | null;

  if (!state) {
    navigate("/test", { replace: true });
    return null;
  }

  const { studentName, grade, branch } = state;

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">
          5–11 sinf uchun test
        </h1>
        <p className="text-sm text-slate-600">
          Ismi: <span className="font-medium">{studentName}</span>, sinfi: {grade}, filial: {branch}
        </p>

        {/* Bu yerga kattaroq bolalar uchun savollarni joylashtirasan */}
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Bu yerga 5 va undan yuqori sinflar uchun mos savollarni qo‘shing.
          </p>
        </div>
      </div>
    </main>
  );
}
