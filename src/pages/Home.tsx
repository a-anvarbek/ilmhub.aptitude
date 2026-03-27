import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import BG from "../assets/image.png";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div
      className="w-full min-vh-100"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container py-5">
        <div className="position-absolute top-0 end-0 mt-3 me-3">
          <LanguageSwitcher />
        </div>

        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6 mx-auto">
            {/* <img
              src="/images/hero-1-min.png"
              className="d-block mx-lg-auto img-fluid"
              alt="logo"
              width="700"
              height="500"
              loading="lazy"
            /> */}
          </div>
          <div className="col-lg-6">
            <div
              dangerouslySetInnerHTML={{
                __html: t("home-banner-title") as string,
              }}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: t("home-banner-subtitle") as string,
              }}
            />

            <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-5">
              <Link
                to="/test"
                className="btn btn-outline-primary px-4 me-md-2 fs-4 text-decoration-none f-sister"
              >
                {t("start-button")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BinaryQuestionComponent from '../components/BinaryQuestion';
// import type { BinaryQuestion } from '../components/BinaryQuestion';
// import { shuffle } from '../utils/collection';
// import { slugify } from '../utils/string';
// import { useTranslation } from 'react-i18next';
// import { telegram } from '../services/telegram';
// import { sendAttemptToTelegram } from '../services/telegramBotService';

// export default function Test() {



    



 

//   return (
//     <div>
//       {started ? (
//         <>
//           <div className="progress position-absolute bottom-0 vw-100">
//             <div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div>
//           </div>
//           {currentQuestion && (
//             <div className="content vh-100 vw-100 row m-0">
//               <div className="col-md-10 col-lg-8 col-xxlg-6 mx-auto my-auto">
//                 <div className="mx-3">
//                   <BinaryQuestionComponent question={currentQuestion} onSelected={(r) => handleSelected(r as any)} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="modal d-block modal-sheet bg-transparent p-4 py-md-5" tabIndex={-1} role="dialog">
//           <div className="modal-dialog" role="document">
//             <div className="modal-content rounded-4 shadow">
//               <div className="modal-header p-5 pb-4 border-bottom-0">
//                 <h1 className="fw-bold mb-0 fs-2">{t('modal.title')}</h1>
//               </div>
//               <div className="modal-body p-5 pt-0">
//                 <form onSubmit={start}>
//                   <div className="form-floating mb-3">
//                     <input value={name} onChange={e => setName(e.target.value)} type="text" className="form-control rounded-3" id="name-input" placeholder={t('modal.name-placeholder') as string} />
//                     <label className="opacity-50" htmlFor="name-input">{t('modal.name-placeholder')}</label>
//                     {!isNameValid && <div className="invalid-feedback d-block"><small className="opacity-50 text-warning-emphasis">{t('modal.name-warning')}</small></div>}
//                   </div>

//                   <div className="input-group mb-3 has-validation">
//                     <span className="input-group-text">+998</span>
//                     <div className="form-floating">
//                       <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="form-control" id="phone-input" placeholder={t('modal.phone-placeholder') as string} />
//                       <label className="opacity-50" htmlFor="phone-input">{t('modal.phone-placeholder')}</label>
//                     </div>
//                     {!validatePhone(phone) && <div className="invalid-feedback d-block"><small className="opacity-50 text-warning-emphasis">{t('modal.phone-warning')}</small></div>}
//                   </div>

//                   <div className="form-floating mb-3">
//                     <input value={grade} onChange={e => setGrade(e.target.value)} type="number" className="form-control rounded-3" id="grade-input" placeholder={t('modal.grade-placeholder') as string} min={1} max={11} />
//                     <label className="opacity-50" htmlFor="grade-input">{t('modal.grade-placeholder')}</label>
//                     {!isGradeValid && <div className="invalid-feedback d-block"><small className="opacity-50 text-warning-emphasis">{t('modal.grade-warning')}</small></div>}
//                   </div>

//                   <div className="form-floating mb-3">
//                     <select
//                       id="filial-select"
//                       className="form-select text-secondary fw-normal"
//                       value={filial}
//                       onChange={e => onFilialChange(e.target.value)}
//                       required
//                     >
//                       <option value="" hidden />
//                       {filialOptions.map(f => (
//                         <option key={f.value} value={f.value}>{f.label}</option>
//                       ))}
//                     </select>
//                     <label htmlFor="filial-select" className="opacity-50 fs-6">{t('modal.select-filial')}</label>
//                     {!filial && <div className="invalid-feedback d-block"><small className="opacity-50 text-warning-emphasis">{t('modal.select-filial-warning') ?? 'Please choose filial'}</small></div>}
//                   </div>

//                   <button type="submit" className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
//                     disabled={!validatePhone(phone) || (!isTelegram && !isNameValid) || !filial}>
//                     {t('modal.submit-button')}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }