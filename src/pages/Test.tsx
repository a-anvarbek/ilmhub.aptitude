import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import BG from "../assets/loginImage.png";

export default function Test() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const nameInput = form.elements.namedItem(
      "studentName",
    ) as HTMLInputElement;
    const phoneInput = form.elements.namedItem(
      "parentPhone",
    ) as HTMLInputElement;
    const gradeInput = form.elements.namedItem("grade") as HTMLInputElement;
    const branchInput = form.elements.namedItem("branch") as HTMLSelectElement;

    const studentName = nameInput.value.trim();
    const parentPhone = phoneInput.value.trim();
    const branch = branchInput.value;
    const grade = Number(gradeInput.value);

    if (!studentName || studentName.length < 3) {
      alert("Iltimos, o'quvchi ismini to'g'ri kiriting.");
      return;
    }
    if (!parentPhone || parentPhone.length < 9) {
      alert("Iltimos, telefon raqamini to'g'ri kiriting.");
      return;
    }
    if (!grade || grade < 1 || grade > 11) {
      alert("Iltimos, sinfni 1–11 oralig'ida kiriting.");
      return;
    }
    if (!branch) {
      alert("Iltimos, filialni tanlang.");
      return;
    }

    const payload = {
      studentName,
      parentPhone,
      grade,
      branch,
    };

    if (grade <= 4) {
      navigate("/test/primary", { state: payload });
    } else {
      navigate("/test/secondary", { state: payload });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-md-5 relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="modal-dialog relative z-10">
        <div
          className="modal-content rounded-4 shadow bg-white/80 backdrop-blur-md p-2"
          style={{ borderRadius: "40px" }}
        >
          {/* HEADER */}
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h1 className="fw-bold mb-0 fs-2 text-center text-white">
              Ilmhub Kids Qobiliyat Testi
            </h1>
          </div>

          {/* BODY */}
          <div className="modal-body p-5 pt-0">
            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="form-floating mb-3">
                <input
                  name="studentName"
                  type="text"
                  className="form-control rounded-3 bg-white/90"
                  id="name-input"
                  placeholder="O'quvchi ismi"
                />
                <label htmlFor="name-input" className="opacity-50">
                  O'quvchi ismi
                </label>
              </div>

              {/* PHONE */}
              <div className="input-group mb-3">
                <span className="input-group-text">+998</span>
                <div className="form-floating">
                  <input
                    name="parentPhone"
                    type="tel"
                    className="form-control bg-white/90"
                    id="phone-input"
                    placeholder="Telefon raqami"
                  />
                  <label htmlFor="phone-input" className="opacity-50">
                    Telefon raqami
                  </label>
                </div>
              </div>

              {/* GRADE */}
              <div className="form-floating mb-3">
                <input
                  name="grade"
                  type="number"
                  min={1}
                  max={11}
                  className="form-control rounded-3 bg-white/90"
                  id="grade-input"
                  placeholder="Sinf"
                />
                <label htmlFor="grade-input" className="opacity-50">
                  Nechinchi sinf
                </label>
              </div>

              {/* BRANCH */}
              <div className="form-floating mb-3">
                <select
                  name="branch"
                  id="branch-select"
                  className="form-select fw-normal bg-white/90"
                  defaultValue=""
                >
                  <option value="" hidden />
                  <option value="Namangan (Uychi)">Namangan (Uychi)</option>
                  <option value="Namangan (Shahar)">Namangan (Shahar)</option>
                  <option value="Chimgan">Chimgan</option>
                  <option value="Feruza">Feruza</option>
                  <option value="Yunusobod">Yunusobod</option>
                </select>
                <label htmlFor="branch-select" className="opacity-50">
                  Filial tanlang
                </label>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-100 mb-2 btn btn-lg rounded-3 btn-primary shadow-lg"
              >
                Boshladik
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
