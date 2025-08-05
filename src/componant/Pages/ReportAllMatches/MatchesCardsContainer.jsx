import React, { useState } from "react";
import MatchesReportsCard from "./MatchesReportsCard";
import MatchesWithoutReportsCard from "./MatchesWithoutReportsCard";
import MatchesList from "./MatchesList";
import SimpleMatchesView from "./SimpleMatchesView";

export default function MatchesCardsContainer() {
  const [currentView, setCurrentView] = useState('cards'); // 'cards', 'withReports', 'withoutReports'

  // فتح المباريات مع التقارير
  const openMatchesWithReports = () => {
    setCurrentView('withReports');
  };

  // فتح المباريات بدون تقارير
  const openMatchesWithoutReports = () => {
    setCurrentView('withoutReports');
  };

  // العودة للبطاقات
  const backToCards = () => {
    setCurrentView('cards');
  };

  // عرض المباريات مع التقارير
  if (currentView === 'withReports') {
    return <MatchesList onBack={backToCards} />;
  }

  // عرض المباريات بدون تقارير
  if (currentView === 'withoutReports') {
    return <SimpleMatchesView onBack={backToCards} />;
  }

  // عرض البطاقات الرئيسية
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
        {/* بطاقة المباريات مع التقارير */}
        <MatchesReportsCard onClick={openMatchesWithReports} />
        
        {/* بطاقة المباريات بدون تقارير */}
        <MatchesWithoutReportsCard onClick={openMatchesWithoutReports} />
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