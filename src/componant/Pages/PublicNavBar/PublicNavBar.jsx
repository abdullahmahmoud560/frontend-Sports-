import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../Images/Logo.png";
import Admin from "../SuperAdmin/Admin/Admin";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function PublicNavBar() {
  // بيانات الفرق الافتراضية
  const بياناتالفرق = [
    { معرف: 1, اسم: "الفريق الأول" },
    { معرف: 2, اسم: "الفريق الثاني" },
    { معرف: 3, اسم: "الفريق الثالث" },
    { معرف: 4, اسم: "الفريق الرابع" },
  ];

  const [بحث, setبحث] = useState("");
  const [token, settoken] = useState(null);
  const [loading, setloading] = useState(true);
  const [decoded, setdecoded] = useState(null);

  const التنقل = useNavigate();

  // تصفية الفرق بناءً على البحث
  const الفرق_المصفاة = بياناتالفرق.filter((فريق) =>
    فريق.اسم.toLowerCase().includes(بحث.toLowerCase())
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setloading(false);
      // جعل صفحة المعلومات هي الصفحة الافتراضية
      if (window.location.pathname === "/") {
        التنقل("/Login");
      }
    }, 5000); // تحميل لمدة ثانيتين
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {

  //   const token = localStorage.getItem("token");
  //   settoken(token);

  //   const decoded = jwtDecode(token);
  //   setdecoded(decoded);
  //   // محاكاة وقت التحميل
  //   const timer = setTimeout(() => {
  //     setloading(false);
  //     // جعل صفحة المعلومات هي الصفحة الافتراضية
  //     if (window.location.pathname === "/") {
  //       التنقل("/info");
  //     }
  //   }, 5000); // تحميل لمدة ثانيتين

  //   return () => clearTimeout(timer);
  // }, [التنقل]);

  // شاشة التحميل

  return (
    <>
      {loading === true ? (
        <div className="min-h-screen bg-[#c5c5c5] flex flex-col items-center justify-center">
          <div className="logo-container">
            <img src={logo} alt="شعار البطولة" className="loading-logo " />
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-[#c5c5c5] flex flex-col items-center justify-center py-4 sm:py-6 lg:py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 sm:mb-6 w-full max-w-4xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#ef4343] font-bold drop-shadow leading-tight">
                خليجيه كواترو 2025
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white opacity-80 drop-shadow mt-2">
                الثلاثاء 8 يوليو 2025 - الثلاثاء 15 يوليو 2025
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl">
              {/* شريط التنقل العلوي */}
              <div className="bg-[#ef4343]  text-white rounded-t-lg px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 lg:gap-6">
                  {/* أزرار التنقل */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-1 sm:gap-2 lg:gap-1 xl:gap-2 w-full">
                    {/* الصف الأول: الألبومات والكشوفات */}
                    <button
                      onClick={() => التنقل("/info")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-video w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        ألبوم الفيديوهات
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/info")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-images w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        ألبوم الصور
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/warning-report-public")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-exclamation-triangle w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        كشف الإنذارات
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/goals-report-public")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-futbol w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        كشف الهدافين
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/players")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-broadcast-tower w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        النقل المباشر
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/public-teams")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-trophy w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        ترتيب الفرق
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/public-results-matches")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-chart-bar w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        نتائج المباريات
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/matches")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200"
                    >
                      <i className="fas fa-calendar-alt w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        جدول المباريات
                      </span>
                    </button>

                    <button
                      onClick={() => التنقل("/login")}
                      className="font-medium flex flex-col sm:flex-row items-center gap-1 hover:bg-[white] hover:text-[#ef4343] rounded-md px-1 sm:px-2 lg:px-3 py-2 text-xs lg:text-sm transition-colors duration-200 col-span-2 sm:col-span-3 lg:col-span-1"
                    >
                      <i className="fas fa-sign-in-alt w-3 h-3 sm:w-4 sm:h-4"></i>
                      <span className="text-center leading-tight">
                        لوحة التحكم
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* منطقة المحتوى */}
              <div className="p-2 sm:p-4 lg:p-6">
                <Outlet />
                {token === null ? (
                  <></>
                ) : decoded.Role === "Academy" ? (
                  <Admin />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');
          
          /* أنماط إضافية للشاشات الصغيرة */
          @media (max-width: 640px) {
            .min-h-screen {
              padding: 1rem;
            }
          }
          
          /* ضمان الانتقالات السلسة */
          * {
            transition: all 0.2s ease-in-out;
          }
          
          /* أهداف لمس أفضل للأجهزة المحمولة */
          @media (max-width: 768px) {
            button {
              min-height: 44px;
              min-width: 44px;
            }
          }

          /* حاوية اللوجو */
          .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* تأثير النبض البسيط */
          @keyframes simplePulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.3);
            }
            100% {
              transform: scale(1);
            }
          }

          /* اللوجو النابض */
          .loading-logo {
            width: 90px;
            height: 90px;
            object-fit: contain;
            animation: simplePulse 1.5s ease-in-out infinite;
            display: block;
          }

          /* تحسينات للشاشات المختلفة */
          @media (min-width: 640px) {
            .loading-logo {
              width: 120px;
              height: 120px;
            }
          }

          @media (min-width: 1024px) {
            .loading-logo {
              width: 150px;
              height: 150px;
            }
          }
        `}
      </style>
    </>
  );
}
