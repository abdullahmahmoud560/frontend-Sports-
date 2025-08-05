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
import PublicNavBar from "./componant/Pages/PublicNavBar/PublicNavBar.jsx";
import PublicTeams from "./componant/Pages/PublicNavBar/PublicTeams.jsx";
import PublicResultsMatches from "./componant/Pages/PublicNavBar/PublicResultsMatches.jsx";
import SignForTechnical from "./componant/Pages/SuperAdmin/SignForTechnical/signForTechnical.jsx";
import TableMatch from "./componant/Pages/TableMatch/TableMatch.jsx";
import TableMangments from "./componant/Pages/TableMangments/TableMangments.jsx";
import WarningReport from "./componant/Pages/WarningReport/WarningReport.jsx";
import Goals from "./componant/Pages/Goals/Goals.jsx";
import ReportAllMatches from "./componant/Pages/ReportAllMatches/ReportAllMatches.jsx";
import ActiveNoActive from "./componant/Pages/ActiveNoActive/ActiveNoActive.jsx";
import MatchesList from "./componant/Pages/ReportAllMatches/MatchesList.jsx";
import WarningReportPublic from "./componant/Pages/PublicComponents/WarningReportPublic.jsx";
import GoalsPublic from "./componant/Pages/PublicComponents/GoalsPublic.jsx";
// تكوين مسارات التطبيق
const مسارات_التطبيق = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      // الصفحات الرئيسية
      { path: "info", element: <Info /> },
      { path: "public-info", element: <PublicNavBar /> },
      // صفحة المعلومات
      { path: "teams", element: <Teams /> }, // صفحة الفرق
      { path: "public-teams", element: <PublicTeams /> }, // صفحة جدول ترتيب الفرق العامة
      { path: "matches", element: <Matches /> }, // صفحة المباريات
      { path: "shedulde", element: <Shedulde /> }, // صفحة الجدول الزمني
      { path: "NavBar", element: <NavBar /> },
      { path: "public-results-matches", element: <PublicResultsMatches /> }, // صفحة نتائج المباريات العامة
      { path: "sign-for-technical", element: <SignForTechnical /> }, // صفحة تسجيل التقنيين
      { path: "table-match", element: <TableMatch /> }, // صفحة جدول المباريات
      { path: "table-mangments", element: <TableMangments /> }, // صفحة جدول المباريات
      { path: "warning-report", element: <WarningReport /> }, // صفحة جدول المباريات
      { path: "goals-report", element: <Goals /> }, // صفحة جدول المباريات
      { path: "report-all-matches", element: <ReportAllMatches /> }, // صفحة جدول المباريات
      { path: "active-no-active", element: <ActiveNoActive /> }, // صفحة جدول المباريات
      { path: "matches-list", element: <MatchesList /> }, // صفحة جدول المباريات
      { path: "warning-report-public", element: <WarningReportPublic /> }, // صفحة جدول المباريات
      { path: "goals-report-public", element: <GoalsPublic /> }, // صفحة جدول المباريات
      // صفحة اللاندينغ
      // صفحات الإدارة
      { path: "admin", element: <Admin /> }, // لوحة الإدارة
      { path: "landing-admin", element: <LandingAdmin /> }, // صفحة دخول الإدارة
      { path: "academies", element: <Acadimics /> }, // إدارة الأكاديميات
      { path: "players", element: <Players /> }, // إدارة اللاعبين
      { path: "mange-matches", element: <MangeMatches /> }, // إدارة المباريات
      { path: "mange-shedulde", element: <MangeShedulde /> }, // إدارة الجدول الزمني
      { path: "camp", element: <Camp /> }, // إدارة المعسكرات
      { path: "result-matches", element: <ResultMatches /> }, // نتائج المباريات
      { path: "teams-ranking", element: <TeamsRanking /> }, // ترتيب الفرق
      { path: "login", element: <Login /> }, // تسجيل الدخول
      { path: "rules", element: <Rules /> }, // القواعد
      { path: "logout", element: <LogOut /> }, // تسجيل الخروج
    ],
  },
]);

// إنشاء عنصر الجذر للتطبيق
const عنصر_الجذر = ReactDOM.createRoot(document.getElementById("root"));

// عرض التطبيق
عنصر_الجذر.render(<RouterProvider router={مسارات_التطبيق} />);
