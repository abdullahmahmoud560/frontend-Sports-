import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportDetailsViewer from "./ReportDetailsViewer";
import "./ReportAllMatches.css";

export default function SimpleMatchesView({ onBack }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // جلب المباريات من API
  const GetDetailsReports = async (id) => {
    try {
      setLoadingDetails(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Details-Reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Report Details Response:", response.data);
      setReportDetails(response.data);
    } catch (error) {
      console.error("Error fetching report details:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "خطأ في جلب تفاصيل التقرير"
      );
      setReportDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

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
        `${process.env.REACT_APP_API_URL}/Get-Show-Reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
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

  // تحديث قائمة المباريات
  const refreshMatches = () => {
    fetchMatches();
  };

  // فتح تفاصيل التقرير
  const openReportDetails = (match, id) => {
    setSelectedMatch(match);
    setShowDetails(true);
    GetDetailsReports(id);
  };

  // إغلاق تفاصيل التقرير
  const closeReportDetails = () => {
    setSelectedMatch(null);
    setShowDetails(false);
    setReportDetails(null);
    setLoadingDetails(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // عرض تفاصيل التقرير
  if (showDetails && selectedMatch) {
    return (
      <ReportDetailsViewer
        reportDetails={reportDetails}
        selectedMatch={selectedMatch}
        loadingDetails={loadingDetails}
        error={error}
        onClose={closeReportDetails}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="matches-list-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المباريات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-list-page">
      {/* Header */}
      <div className="page-header" style={{ background: "#17a2b8" }}>
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            <i className="back-icon">←</i>
            العودة للبطاقات
          </button>
        )}
        <h1 className="page-title">المباريات - عرض مبسط</h1>
        <p className="page-subtitle">
          عرض سريع لجميع المباريات والنتائج بدون تقارير
        </p>

        <div className="header-actions">
          <button className="refresh-btn" onClick={refreshMatches}>
            <i className="refresh-icon">🔄</i>
            تحديث
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
          <div className="simple-matches-grid">
            {matches.map((match) => (
              <div key={match.id} className="simple-match-card">
                <div className="simple-match-header">
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

                <div className="simple-match-teams">
                  <div className="simple-team home-team">
                    <div className="team-name">
                      {match.homeTeam || match.team1Name || "الفريق الأول"}
                    </div>
                    <div className="team-score">
                      {match.homeScore !== undefined ? match.homeScore : "-"}
                    </div>
                  </div>

                  <div className="vs-divider">VS</div>

                  <div className="simple-team away-team">
                    <div className="team-score">
                      {match.awayScore !== undefined ? match.awayScore : "-"}
                    </div>
                    <div className="team-name">
                      {match.awayTeam || match.team2Name || "الفريق الثاني"}
                    </div>
                  </div>
                </div>

                <div className="simple-match-details">
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

                {/* معلومات إضافية بسيطة */}
                <div className="simple-match-info">
                  <div className="info-item">
                    <span className="info-label">الحالة:</span>
                    <span className="info-value">
                      {match.status === "completed" ? "انتهت" : "قادمة"}
                    </span>
                  </div>
                  {match.goals && (
                    <div className="info-item">
                      <span className="info-label">الأهداف:</span>
                      <span className="info-value">{match.goals}</span>
                    </div>
                  )}
                </div>

                {/* زر تفاصيل التقارير */}
                <div className="simple-match-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => openReportDetails(match, match.id)}
                  >
                    <i className="details-icon">👁️</i>
                    تفاصيل التقارير
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
