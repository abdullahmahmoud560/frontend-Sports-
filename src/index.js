import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Info from "./componant/Pages/Info/Info.jsx";
import App from "./App.jsx";
import Teams from "./componant/Pages/Teams/Teams.jsx";
import Matches from "./componant/Pages/Matches/Matches.jsx";
import Shedulde from "./componant/Pages/Shedulde/Shedulde.jsx";
import Admin from "./componant/Pages/SuperAdmin/Admin/Admin.jsx";
import LandingAdmin from "./componant/Pages/SuperAdmin/LandingAdmin/LandingAdmin.jsx";
import Acadimics from "./componant/Pages/SuperAdmin/Acadimics/Acadimics.jsx";
import Players from "./componant/Pages/SuperAdmin/Players/Players.jsx";
import MangeMatches from "./componant/Pages/SuperAdmin/MangeMatches/MangeMatches.jsx";
import MangeShedulde from "./componant/Pages/SuperAdmin/MangeSheduldematches/MangeShedulde.jsx";
import Camp from "./componant/Pages/SuperAdmin/Camp/Camp.jsx";
import ResultMatches from "./componant/Pages/SuperAdmin/ResultMatches/ResultMatches.jsx";
import TeamsRanking from "./componant/Pages/SuperAdmin/TeamsRanking/TeamsRanking.jsx";
import Login from "./componant/Pages/SuperAdmin/Login/Login.jsx";
import Rules from "./componant/Pages/SuperAdmin/Rules/Rules.jsx";
import LogOut from "./componant/Pages/LogOut/LogOut.jsx";
import NavBar from "./componant/Pages/NavBar/NavBar.jsx";

// تكوين مسارات التطبيق
const مسارات_التطبيق = createBrowserRouter([
  {
    
    path: "",
    element: <App/>,
    children: [

      // الصفحات الرئيسية
      { path: "info", element: <Info /> },           // صفحة المعلومات
      { path: "teams", element: <Teams /> },         // صفحة الفرق
      { path: "matches", element: <Matches /> },     // صفحة المباريات
      { path: "shedulde", element: <Shedulde /> },   // صفحة الجدول الزمني
      { path: "NavBar", element: <NavBar /> },     // صفحة اللاندينغ
      // صفحات الإدارة
      { path: "admin", element: <Admin /> },                    // لوحة الإدارة
      { path: "landing-admin", element: <LandingAdmin /> },     // صفحة دخول الإدارة
      { path: "academies", element: <Acadimics /> },            // إدارة الأكاديميات
      { path: "players", element: <Players /> },                // إدارة اللاعبين
      { path: "mange-matches", element: <MangeMatches /> },     // إدارة المباريات
      { path: "mange-shedulde", element: <MangeShedulde /> },   // إدارة الجدول الزمني
      { path: "camp", element: <Camp /> },                      // إدارة المعسكرات
      { path: "result-matches", element: <ResultMatches /> },   // نتائج المباريات
      { path: "teams-ranking", element: <TeamsRanking /> },     // ترتيب الفرق
      { path: "login", element: <Login /> },                    // تسجيل الدخول
      { path: "rules", element: <Rules /> },                    // القواعد
      { path: "logout", element: <LogOut /> },                  // تسجيل الخروج
    ],
  },
]);

// إنشاء عنصر الجذر للتطبيق
const عنصر_الجذر = ReactDOM.createRoot(document.getElementById("root"));

// عرض التطبيق
عنصر_الجذر.render(
  <RouterProvider router={مسارات_التطبيق} />
);
