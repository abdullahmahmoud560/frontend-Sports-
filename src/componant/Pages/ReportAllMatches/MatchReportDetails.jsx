import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReportAllMatches.css";

export default function MatchReportDetails({ matchId, matchData, onClose }) {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب تفاصيل التقرير من API
  const fetchReportDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Match-Report/${matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "خطأ في جلب تفاصيل التقرير"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (matchId) {
      fetchReportDetails();
    }
  }, [matchId]);

  if (isLoading) {
    return (
      <div className="report-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل تفاصيل التقرير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-details-page">
        <div className="page-header">
          <button className="back-btn" onClick={onClose}>
            <i className="back-icon">←</i>
            العودة
          </button>
          <h1 className="page-title">تفاصيل التقرير</h1>
        </div>
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          {error}
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="report-details-page">
        <div className="page-header">
          <button className="back-btn" onClick={onClose}>
            <i className="back-icon">←</i>
            العودة
          </button>
          <h1 className="page-title">تفاصيل التقرير</h1>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>لا يوجد تقرير</h3>
          <p>لم يتم إنشاء تقرير لهذه المباراة بعد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-details-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={onClose}>
          <i className="back-icon">←</i>
          العودة
        </button>
        <h1 className="page-title">تفاصيل تقرير المباراة</h1>
        {matchData && (
          <div className="match-info-header">
            <span className="teams">
              {matchData.homeTeam || matchData.team1Name || "الفريق الأول"} vs{" "}
              {matchData.awayTeam || matchData.team2Name || "الفريق الثاني"}
            </span>
            <span className="match-date">
              {matchData.date
                ? new Date(matchData.date).toLocaleDateString("ar-SA")
                : "غير محدد"}
            </span>
          </div>
        )}
      </div>

      <div className="report-details-content">
        {/* معلومات المباراة */}
        <div className="details-section match-info-section">
          <h3 className="section-title">
            <i className="section-icon">⚽</i>
            معلومات المباراة
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">الفريق المضيف:</span>
              <span className="info-value">
                {matchData?.homeTeam || matchData?.team1Name || "غير محدد"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">الفريق الضيف:</span>
              <span className="info-value">
                {matchData?.awayTeam || matchData?.team2Name || "غير محدد"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">التاريخ:</span>
              <span className="info-value">
                {matchData?.date
                  ? new Date(matchData.date).toLocaleDateString("ar-SA")
                  : "غير محدد"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">الوقت:</span>
              <span className="info-value">{matchData?.time || "غير محدد"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">المكان:</span>
              <span className="info-value">
                {matchData?.venue || matchData?.location || "غير محدد"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">النتيجة:</span>
              <span className="info-value score">
                {matchData?.homeScore !== undefined && matchData?.awayScore !== undefined
                  ? `${matchData.homeScore} - ${matchData.awayScore}`
                  : "لم تحدد بعد"}
              </span>
            </div>
          </div>
        </div>

        {/* قائمة اللاعبين */}
        {reportData.players && reportData.players.length > 0 && (
          <div className="details-section players-details-section">
            <h3 className="section-title">
              <i className="section-icon">👥</i>
              قائمة اللاعبين ({reportData.players.length})
            </h3>
            <div className="details-table-container">
              <table className="details-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم اللاعب</th>
                    <th>المركز</th>
                    <th>أساسي</th>
                    <th>احتياطي</th>
                    <th>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.players.map((player, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="player-name">
                        {player.playerName || player.name || "-"}
                      </td>
                      <td>{player.position || "-"}</td>
                      <td>
                        <span className={`status-badge ${player.essential ? 'active' : 'inactive'}`}>
                          {player.essential || "-"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${player.reserve ? 'reserve' : 'inactive'}`}>
                          {player.reserve || "-"}
                        </span>
                      </td>
                      <td>{player.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* الأهداف */}
        {reportData.goals && reportData.goals.length > 0 && (
          <div className="details-section goals-details-section">
            <h3 className="section-title">
              <i className="section-icon">⚽</i>
              الأهداف ({reportData.goals.length})
            </h3>
            <div className="goals-list">
              {reportData.goals.map((goal, index) => (
                <div key={index} className="goal-item">
                  <div className="goal-header">
                    <span className="goal-player">
                      {goal.playerName || "لاعب غير محدد"}
                    </span>
                    <span className="goal-minute">الدقيقة {goal.minute || "-"}</span>
                  </div>
                  <div className="goal-details">
                    <span className="goal-team">
                      {goal.acadamyName || "الفريق"}
                    </span>
                    {goal.notes && (
                      <span className="goal-notes">{goal.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* البطاقات */}
        {reportData.cards && reportData.cards.length > 0 && (
          <div className="details-section cards-details-section">
            <h3 className="section-title">
              <i className="section-icon">🟨</i>
              البطاقات ({reportData.cards.length})
            </h3>
            <div className="cards-list">
              {reportData.cards.map((card, index) => (
                <div key={index} className="card-item">
                  <div className="card-header">
                    <span className="card-player">
                      {card.playerName || "لاعب غير محدد"}
                    </span>
                    <span className={`card-type ${card.cardType}`}>
                      {card.cardType === "yellow" ? "🟨 صفراء" :
                       card.cardType === "red" ? "🟥 حمراء" :
                       card.cardType === "second_yellow" ? "🟨🟨 صفراء ثانية" :
                       card.cardType || "غير محدد"}
                    </span>
                  </div>
                  <div className="card-details">
                    <span className="card-team">
                      {card.acadamyName || "الفريق"}
                    </span>
                    {card.notes && (
                      <span className="card-notes">{card.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الطاقم الفني */}
        {reportData.staff && reportData.staff.length > 0 && (
          <div className="details-section staff-details-section">
            <h3 className="section-title">
              <i className="section-icon">👨‍⚕️</i>
              الطاقم الفني ({reportData.staff.length})
            </h3>
            <div className="details-table-container">
              <table className="details-table">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>الاسم</th>
                    <th>الدور</th>
                    <th>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.staff.map((staffMember, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="staff-name">
                        {staffMember.techName || staffMember.name || "-"}
                      </td>
                      <td>
                        <span className="role-badge">
                          {staffMember.role === "main_coach" ? "مدرب رئيسي" :
                           staffMember.role === "assistant_coach" ? "مدرب مساعد" :
                           staffMember.role === "goalkeeper_coach" ? "مدرب حراس" :
                           staffMember.role === "doctor" ? "طبيب" :
                           staffMember.role === "physiotherapist" ? "أخصائي علاج طبيعي" :
                           staffMember.role === "manager" ? "مدير" :
                           staffMember.role || "غير محدد"}
                        </span>
                      </td>
                      <td>{staffMember.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="details-section summary-section">
          <h3 className="section-title">
            <i className="section-icon">📊</i>
            ملخص التقرير
          </h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-number">
                {reportData.players ? reportData.players.length : 0}
              </span>
              <span className="summary-label">لاعب</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">
                {reportData.goals ? reportData.goals.length : 0}
              </span>
              <span className="summary-label">هدف</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">
                {reportData.cards ? reportData.cards.length : 0}
              </span>
              <span className="summary-label">بطاقة</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">
                {reportData.staff ? reportData.staff.length : 0}
              </span>
              <span className="summary-label">طاقم فني</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}