import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReportAllMatches.css";

export default function MatchesWithoutReportsCard({ onClick }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // يمكن تخصيص المسار حسب الحاجة
      navigate("/matches-without-reports");
    }
  };

  return (
    <div className="matches-without-reports-card" onClick={handleCardClick}>
      <div className="card-header">
        <div className="card-icon-without">
          <span className="main-icon">⚽</span>
          <span className="secondary-icon">📄</span>
        </div>
        <div className="card-badge-without">
          <span>مباشر</span>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">عرض مباريات بالتقارير</h3>
        <p className="card-description">
          استعرض المباريات والنتائج بدون الحاجة لإنشاء تقارير مفصلة
        </p>
        
        <div className="card-features">
          <div className="feature-item">
            <span className="feature-icon">👀</span>
            <span>عرض النتائج</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>الإحصائيات</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span>عرض سريع</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="card-action">
          <span className="action-text">اضغط للمتابعة</span>
          <span className="action-arrow">←</span>
        </div>
        <div className="card-stats">
          <span className="stats-text">عرض مبسط</span>
        </div>
      </div>
    </div>
  );
}