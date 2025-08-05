import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportAllMatches from "./ReportAllMatches";
import MatchesReportsCard from "./MatchesReportsCard";
import MatchesWithoutReportsCard from "./MatchesWithoutReportsCard";
import SimpleMatchesView from "./SimpleMatchesView";
import MatchReportDetails from "./MatchReportDetails";
import "./ReportAllMatches.css";

export default function MatchesList() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'withReports', 'withoutReports'

  // جلب المباريات من API
  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى."
        );
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Score-Matches-By-Academy`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setMatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "خطأ في جلب بيانات المباريات"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // فتح تقرير المباراة
  const openMatchReport = (match) => {
    setSelectedMatch(match);
    setShowReport(true);
  };

  // إغلاق تقرير المباراة
  const closeMatchReport = () => {
    setSelectedMatch(null);
    setShowReport(false);
  };

  // فتح تفاصيل التقرير
  const openReportDetails = (match) => {
    setSelectedMatch(match);
    setShowDetails(true);
  };

  // إغلاق تفاصيل التقرير
  const closeReportDetails = () => {
    setSelectedMatch(null);
    setShowDetails(false);
  };

  // فتح قائمة المباريات مع التقارير
  const openMatchesList = () => {
    setViewMode('withReports');
    setShowCard(false);
  };

  // فتح قائمة المباريات بدون تقارير
  const openSimpleMatches = () => {
    setViewMode('withoutReports');
    setShowCard(false);
  };

  // العودة للبطاقات
  const backToCard = () => {
    setViewMode('cards');
    setShowCard(true);
  };

  // تحديث قائمة المباريات
  const refreshMatches = () => {
    fetchMatches();
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <div className="matches-list-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل قائمة المباريات...</p>
        </div>
      </div>
    );
  }

  // عرض البطاقات أولاً
  if (showCard) {
    return (
      <div style={{
        padding: "40px 20px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "50px"
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#333",
            marginBottom: "15px",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            إدارة المباريات
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            اختر نوع العرض المناسب لاحتياجاتك
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "40px",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          <MatchesReportsCard onClick={openMatchesList} />
          <MatchesWithoutReportsCard onClick={openSimpleMatches} />
        </div>

        <div style={{
          textAlign: "center",
          marginTop: "60px",
          padding: "30px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "15px",
          maxWidth: "800px",
          margin: "60px auto 0"
        }}>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>
            الفرق بين النوعين:
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            textAlign: "right"
          }}>
            <div style={{ padding: "15px" }}>
              <h4 style={{ color: "#ef4343", marginBottom: "10px" }}>
                📊 مع التقارير
              </h4>
              <ul style={{ color: "#666", lineHeight: "1.8" }}>
                <li>إنشاء تقارير مفصلة</li>
                <li>إدارة اللاعبين والطاقم الفني</li>
                <li>تسجيل الأهداف والبطاقات</li>
                <li>حفظ البيانات في النظام</li>
              </ul>
            </div>
            <div style={{ padding: "15px" }}>
              <h4 style={{ color: "#17a2b8", marginBottom: "10px" }}>
                ⚡ بدون تقارير
              </h4>
              <ul style={{ color: "#666", lineHeight: "1.8" }}>
                <li>عرض سريع للمباريات</li>
                <li>مشاهدة النتائج والإحصائيات</li>
                <li>واجهة مبسطة وسريعة</li>
                <li>تصفح بدون تعقيدات</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض المباريات بدون تقارير
  if (viewMode === 'withoutReports') {
    return <SimpleMatchesView onBack={backToCard} />;
  }

  // عرض تفاصيل التقرير
  if (showDetails && selectedMatch) {
    return (
      <MatchReportDetails
        matchId={selectedMatch.id}
        matchData={selectedMatch}
        onClose={closeReportDetails}
      />
    );
  }

  if (showReport && selectedMatch) {
    return (
      <ReportAllMatches
        matchId={selectedMatch.id}
        matchData={selectedMatch}
        onClose={closeMatchReport}
      />
    );
  }

  return (
    <div className="matches-list-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={backToCard}>
          <i className="back-icon">←</i>
          العودة للبطاقات
        </button>
        <h1 className="page-title">قائمة المباريات</h1>
        <p className="page-subtitle">اختر مباراة لإنشاء أو تعديل تقريرها</p>

        <div className="header-actions">
          <button className="refresh-btn" onClick={refreshMatches}>
            <i className="refresh-icon">🔄</i>
            تحديث القائمة
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="error-message">
            <i className="error-icon">⚠️</i>
            {error}
          </div>
        )}
      </div>

      {/* Matches List */}
      <div className="matches-container">
        {matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <h3>لا توجد مباريات</h3>
            <p>لم يتم العثور على أي مباريات في الأكاديمية</p>
            <button className="refresh-btn" onClick={refreshMatches}>
              <i className="refresh-icon">🔄</i>
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => (
              <div key={match.id} className="match-card">
                <div className="match-header">
                  <div className="match-status">
                    <span
                      className={`status-badge ${match.status || "pending"}`}
                    >
                      {match.status === "completed"
                        ? "مكتملة"
                        : match.status === "live"
                        ? "جارية"
                        : match.status === "cancelled"
                        ? "ملغية"
                        : "منتظرة"}
                    </span>
                  </div>
                  <div className="match-date">
                    {match.date
                      ? new Date(match.date).toLocaleDateString("ar-SA")
                      : "غير محدد"}
                  </div>
                </div>

                <div className="match-teams">
                  <div className="team home-team">
                    <div className="team-name">
                      {match.homeTeam || match.team1Name || "الفريق الأول"}
                    </div>
                    <div className="team-score">
                      {match.homeScore !== undefined ? match.homeScore : "-"}
                    </div>
                  </div>

                  <div className="vs-divider">VS</div>

                  <div className="team away-team">
                    <div className="team-score">
                      {match.awayScore !== undefined ? match.awayScore : "-"}
                    </div>
                    <div className="team-name">
                      {match.awayTeam || match.team2Name || "الفريق الثاني"}
                    </div>
                  </div>
                </div>

                <div className="match-details">
                  <div className="detail-item">
                    <i className="detail-icon">🏟️</i>
                    <span>{match.venue || match.location || "غير محدد"}</span>
                  </div>
                  <div className="detail-item">
                    <i className="detail-icon">⏰</i>
                    <span>{match.time || "غير محدد"}</span>
                  </div>
                  {match.round && (
                    <div className="detail-item">
                      <i className="detail-icon">🏆</i>
                      <span>الجولة {match.round}</span>
                    </div>
                  )}
                </div>

                <div className="match-actions">
                  <button
                    className="report-btn"
                    onClick={() => openMatchReport(match)}
                  >
                    <i className="report-icon">📋</i>
                    {match.hasReport ? "تعديل التقرير" : "إنشاء تقرير"}
                  </button>
                  <button
                    className="view-details-btn"
                    onClick={() => openReportDetails(match)}
                  >
                    <i className="details-icon">👁️</i>
                    عرض تفاصيل التقرير
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
