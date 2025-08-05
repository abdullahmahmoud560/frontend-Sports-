import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReportAllMatches.css";

export default function MatchesReportsCard({ onClick }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // يمكن تخصيص المسار حسب الحاجة
      navigate("/matches-reports");
    }
  };

  return (
    <div className="matches-reports-card" onClick={handleCardClick}>
      <div className="card-header">
        <div className="card-icon">
          <span className="main-icon">📊</span>
          <span className="secondary-icon">⚽</span>
        </div>
        <div className="card-badge">
          <span>جديد</span>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">عرض المباريات بدون تقارير</h3>
        <p className="card-description">
          استعرض جميع المباريات وقم بإنشاء أو تعديل تقارير المباريات بسهولة
        </p>
        
        <div className="card-features">
          <div className="feature-item">
            <span className="feature-icon">📋</span>
            <span>إنشاء تقارير</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✏️</span>
            <span>تعديل البيانات</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            <span>متابعة النتائج</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="card-action">
          <span className="action-text">اضغط للمتابعة</span>
          <span className="action-arrow">←</span>
        </div>
        <div className="card-stats">
          <span className="stats-text">نظام شامل</span>
        </div>
      </div>
    </div>
  );
}