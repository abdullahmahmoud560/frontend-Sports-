import React, { useState } from "react";
import MatchesReportsCard from "./MatchesReportsCard";
import MatchesList from "./MatchesList";

// مثال لكيفية استخدام البطاقة في لوحة التحكم أو أي صفحة
export default function ExampleCardUsage() {
  const [showMatchesList, setShowMatchesList] = useState(false);

  // فتح قائمة المباريات
  const openMatchesList = () => {
    setShowMatchesList(true);
  };

  // العودة للوحة التحكم
  const backToDashboard = () => {
    setShowMatchesList(false);
  };

  // إذا كان يعرض قائمة المباريات
  if (showMatchesList) {
    return (
      <div>
        <button 
          onClick={backToDashboard}
          style={{
            margin: "20px",
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ← العودة للوحة التحكم
        </button>
        <MatchesList />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: "#f8f9fa", 
      minHeight: "100vh" 
    }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "40px", 
        color: "#333" 
      }}>
        لوحة التحكم
      </h1>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* بطاقة تقارير المباريات */}
        <MatchesReportsCard onClick={openMatchesList} />
        
        {/* بطاقات أخرى يمكن إضافتها */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          border: "2px dashed #ddd"
        }}>
          بطاقة أخرى يمكن إضافتها
        </div>
        
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          border: "2px dashed #ddd"
        }}>
          بطاقة أخرى يمكن إضافتها
        </div>
      </div>
      
      <div style={{ 
        marginTop: "40px", 
        textAlign: "center", 
        color: "#666" 
      }}>
        <h3>كيفية الاستخدام:</h3>
        <p>اضغط على بطاقة "عرض المباريات بالتقارير" لفتح قائمة المباريات</p>
      </div>
    </div>
  );
}