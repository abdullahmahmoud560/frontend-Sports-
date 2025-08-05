import React, { useState } from "react";
import MatchesList from "./MatchesList";
import MatchesReportsCard from "./MatchesReportsCard";

// كومبوننت بسيط يحتوي على البطاقة وقائمة المباريات
export default function SimpleMatchesCard() {
  const [showList, setShowList] = useState(false);

  if (showList) {
    return (
      <div>
        {/* زر العودة */}
        <div style={{ padding: "20px" }}>
          <button 
            onClick={() => setShowList(false)}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ← العودة
          </button>
        </div>
        
        {/* قائمة المباريات */}
        <MatchesList />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px"
    }}>
      <MatchesReportsCard onClick={() => setShowList(true)} />
    </div>
  );
}