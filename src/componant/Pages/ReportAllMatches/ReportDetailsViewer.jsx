import React from "react";
import "./ReportAllMatches.css";

export default function ReportDetailsViewer({ 
  reportDetails, 
  selectedMatch, 
  loadingDetails, 
  error, 
  onClose 
}) {
  if (loadingDetails) {
    return (
      <div className="report-viewer-page">
        <div className="page-header">
          <button className="back-btn" onClick={onClose}>
            <i className="back-icon">←</i>
            العودة
          </button>
          <h1 className="page-title">تفاصيل التقرير</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل تفاصيل التقرير...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-viewer-page">
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

  if (!reportDetails) {
    return (
      <div className="report-viewer-page">
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
          <p>لم يتم العثور على تقرير لهذه المباراة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-viewer-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={onClose}>
          <i className="back-icon">←</i>
          العودة للمباريات
        </button>
        <h1 className="page-title">تفاصيل تقرير المباراة</h1>
        {selectedMatch && (
          <div className="match-info-header">
            <span className="teams">
              {selectedMatch.homeTeam || selectedMatch.team1Name || "الفريق الأول"} vs{" "}
              {selectedMatch.awayTeam || selectedMatch.team2Name || "الفريق الثاني"}
            </span>
            <span className="match-date">
              {selectedMatch.date
                ? new Date(selectedMatch.date).toLocaleDateString("ar-SA")
                : "غير محدد"}
            </span>
          </div>
        )}
      </div>

      <div className="report-viewer-content">
        {/* معلومات أساسية */}
        <div className="viewer-section match-overview">
          <h3 className="section-title">
            <i className="section-icon">⚽</i>
            نظرة عامة على المباراة
          </h3>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">👥</div>
              <div className="card-content">
                <div className="card-number">
                  {reportDetails.players ? reportDetails.players.length : 0}
                </div>
                <div className="card-label">لاعب</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">⚽</div>
              <div className="card-content">
                <div className="card-number">
                  {reportDetails.goals ? reportDetails.goals.length : 0}
                </div>
                <div className="card-label">هدف</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">🟨</div>
              <div className="card-content">
                <div className="card-number">
                  {reportDetails.cards ? reportDetails.cards.length : 0}
                </div>
                <div className="card-label">بطاقة</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">👨‍⚕️</div>
              <div className="card-content">
                <div className="card-number">
                  {reportDetails.staff ? reportDetails.staff.length : 0}
                </div>
                <div className="card-label">طاقم فني</div>
              </div>
            </div>
          </div>
        </div>

        {/* قائمة اللاعبين */}
        {reportDetails.players && reportDetails.players.length > 0 && (
          <div className="viewer-section players-viewer">
            <h3 className="section-title">
              <i className="section-icon">👥</i>
              قائمة اللاعبين ({reportDetails.players.length})
            </h3>
            <div className="players-grid">
              {reportDetails.players.map((player, index) => (
                <div key={index} className="player-card">
                  <div className="player-header">
                    <div className="player-number">#{index + 1}</div>
                    <div className="player-status">
                      {player.essential && (
                        <span className="status-badge essential">أساسي</span>
                      )}
                      {player.reserve && (
                        <span className="status-badge reserve">احتياطي</span>
                      )}
                    </div>
                  </div>
                  <div className="player-info">
                    <h4 className="player-name">
                      {player.playerName || player.name || "لاعب غير محدد"}
                    </h4>
                    <p className="player-position">
                      {player.position || "المركز غير محدد"}
                    </p>
                    {player.notes && (
                      <p className="player-notes">{player.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الأهداف */}
        {reportDetails.goals && reportDetails.goals.length > 0 && (
          <div className="viewer-section goals-viewer">
            <h3 className="section-title">
              <i className="section-icon">⚽</i>
              أهداف المباراة ({reportDetails.goals.length})
            </h3>
            <div className="goals-timeline">
              {reportDetails.goals.map((goal, index) => (
                <div key={index} className="goal-timeline-item">
                  <div className="timeline-marker">
                    <div className="marker-icon">⚽</div>
                    <div className="marker-time">د{goal.minute || "؟"}</div>
                  </div>
                  <div className="timeline-content">
                    <div className="goal-player">
                      {goal.playerName || "لاعب غير محدد"}
                    </div>
                    <div className="goal-team">
                      {goal.acadamyName || goal.teamName || "الفريق"}
                    </div>
                    {goal.notes && (
                      <div className="goal-description">{goal.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* البطاقات */}
        {reportDetails.cards && reportDetails.cards.length > 0 && (
          <div className="viewer-section cards-viewer">
            <h3 className="section-title">
              <i className="section-icon">🟨</i>
              بطاقات المباراة ({reportDetails.cards.length})
            </h3>
            <div className="cards-grid">
              {reportDetails.cards.map((card, index) => (
                <div key={index} className={`card-incident ${card.cardType}`}>
                  <div className="card-icon">
                    {card.cardType === "yellow" ? "🟨" :
                     card.cardType === "red" ? "🟥" :
                     card.cardType === "second_yellow" ? "🟨🟨" : "🟨"}
                  </div>
                  <div className="card-details">
                    <div className="card-player">
                      {card.playerName || "لاعب غير محدد"}
                    </div>
                    <div className="card-team">
                      {card.acadamyName || card.teamName || "الفريق"}
                    </div>
                    <div className="card-type-label">
                      {card.cardType === "yellow" ? "بطاقة صفراء" :
                       card.cardType === "red" ? "بطاقة حمراء" :
                       card.cardType === "second_yellow" ? "بطاقة صفراء ثانية" :
                       "بطاقة"}
                    </div>
                    {card.notes && (
                      <div className="card-notes">{card.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الطاقم الفني */}
        {reportDetails.staff && reportDetails.staff.length > 0 && (
          <div className="viewer-section staff-viewer">
            <h3 className="section-title">
              <i className="section-icon">👨‍⚕️</i>
              الطاقم الفني ({reportDetails.staff.length})
            </h3>
            <div className="staff-list">
              {reportDetails.staff.map((staffMember, index) => (
                <div key={index} className="staff-item">
                  <div className="staff-avatar">
                    <span className="avatar-icon">
                      {staffMember.role === "main_coach" ? "👨‍🏫" :
                       staffMember.role === "assistant_coach" ? "👨‍🎓" :
                       staffMember.role === "doctor" ? "👨‍⚕️" :
                       staffMember.role === "goalkeeper_coach" ? "🥅" :
                       "👨‍💼"}
                    </span>
                  </div>
                  <div className="staff-info">
                    <h4 className="staff-name">
                      {staffMember.techName || staffMember.name || "عضو الطاقم"}
                    </h4>
                    <p className="staff-role">
                      {staffMember.role === "main_coach" ? "مدرب رئيسي" :
                       staffMember.role === "assistant_coach" ? "مدرب مساعد" :
                       staffMember.role === "goalkeeper_coach" ? "مدرب حراس" :
                       staffMember.role === "doctor" ? "طبيب" :
                       staffMember.role === "physiotherapist" ? "أخصائي علاج طبيعي" :
                       staffMember.role === "manager" ? "مدير" :
                       staffMember.role || "دور غير محدد"}
                    </p>
                    {staffMember.notes && (
                      <p className="staff-notes">{staffMember.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        {reportDetails.matchInfo && (
          <div className="viewer-section additional-info">
            <h3 className="section-title">
              <i className="section-icon">📋</i>
              معلومات إضافية
            </h3>
            <div className="info-grid">
              {reportDetails.matchInfo.referee && (
                <div className="info-item">
                  <span className="info-label">الحكم:</span>
                  <span className="info-value">{reportDetails.matchInfo.referee}</span>
                </div>
              )}
              {reportDetails.matchInfo.weather && (
                <div className="info-item">
                  <span className="info-label">حالة الطقس:</span>
                  <span className="info-value">{reportDetails.matchInfo.weather}</span>
                </div>
              )}
              {reportDetails.matchInfo.attendance && (
                <div className="info-item">
                  <span className="info-label">الحضور:</span>
                  <span className="info-value">{reportDetails.matchInfo.attendance}</span>
                </div>
              )}
              {reportDetails.createdAt && (
                <div className="info-item">
                  <span className="info-label">تاريخ إنشاء التقرير:</span>
                  <span className="info-value">
                    {new Date(reportDetails.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}