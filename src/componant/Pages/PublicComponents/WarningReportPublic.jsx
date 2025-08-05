import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const WarningReportPublic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [warningsData, setWarningsData] = useState({
    "فئة 12 سنة": [],
    "فئة 14 سنة": [],
    "فئة 16 سنة": [],
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

  // Map URL parameters to category names
  const urlToCategory = {
    U12: "فئة 12 سنة",
    U14: "فئة 14 سنة",
    U16: "فئة 16 سنة",
  };

  // Map category names to URL parameters
  const categoryToUrl = {
    "فئة 12 سنة": "U12",
    "فئة 14 سنة": "U14",
    "فئة 16 سنة": "U16",
  };

  // Initialize category from URL on component mount
  useEffect(() => {
    const ageParam = searchParams.get("age");
    if (ageParam && urlToCategory[ageParam]) {
      setSelectedCategory(urlToCategory[ageParam]);
    }
  }, [searchParams, urlToCategory]);

  const fetchWarningsData = useCallback(async (ageCategory = null) => {
    try {
      setIsLoading(true);
      setError(null);
      // Build URL with age parameter if provided
      let apiUrl = `${process.env.REACT_APP_API_URL}/Public-Cards-Report`;
      if (ageCategory) {
        apiUrl += `/${ageCategory}`;
      }

      console.log("Fetching warnings data from API...", {
        url: apiUrl,
        ageCategory,
      });
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Warnings API Response:", data);

      // Process and organize the data by age categories
      const organizedData = organizeWarningsByAge(data, ageCategory);
      console.log("Organized Warnings Data:", organizedData);
      setWarningsData((prev) => ({ ...prev, ...organizedData }));
      setHasDataLoaded(true);
    } catch (error) {
      console.error("Error fetching warnings data:", error);
      setError(`خطأ في تحميل البيانات: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle category click - fetch data only when category is clicked
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      // Remove age parameter from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("age");
      setSearchParams(newParams);
    } else {
      setSelectedCategory(category);
      // Add age parameter to URL
      const newParams = new URLSearchParams(searchParams);
      newParams.set("age", categoryToUrl[category]);
      setSearchParams(newParams);

      // Always fetch data for the selected category
      const ageParam = categoryToUrl[category];
      fetchWarningsData(ageParam);
    }
  };

  // Function to organize API data by age categories
  const organizeWarningsByAge = (apiData, targetCategory = null) => {
    const organizedData = {};

    // Initialize only the target category if specified
    if (targetCategory) {
      const categoryName = urlToCategory[targetCategory];
      if (categoryName) {
        organizedData[categoryName] = [];
      }
    } else {
      // Initialize all categories if no target specified
      organizedData["فئة 12 سنة"] = [];
      organizedData["فئة 14 سنة"] = [];
      organizedData["فئة 16 سنة"] = [];
    }

    // Handle different data structures
    let dataArray = [];

    if (Array.isArray(apiData)) {
      dataArray = apiData;
    } else if (apiData && typeof apiData === "object") {
      // If it's an object, try to extract array from common properties
      if (apiData.data && Array.isArray(apiData.data)) {
        dataArray = apiData.data;
      } else if (apiData.results && Array.isArray(apiData.results)) {
        dataArray = apiData.results;
      } else if (apiData.warnings && Array.isArray(apiData.warnings)) {
        dataArray = apiData.warnings;
      } else {
        console.warn("Cannot find array in API response:", apiData);
        return organizedData;
      }
    } else {
      console.warn("API data is not in expected format:", apiData);
      return organizedData;
    }

    dataArray.forEach((warning, index) => {
      console.log(`Processing warning ${index}:`, warning);

      // Map API fields to our component structure
      const mappedWarning = {
        id: warning.id || warning.cardId || index + 1,
        playerName: warning.playerName || warning.name || `لاعب ${index + 1}`,
        academyName: warning.academyName || warning.teamName || warning.team || "أكاديمية غير محددة",
        team: warning.academyName || warning.teamName || warning.team || "فريق غير محدد",
        yellowCards: parseInt(warning.yellowCards || 0),
        redCards: parseInt(warning.redCards || 0),
        totalCards: parseInt(warning.totalCards || warning.yellowCards + warning.redCards || 0),
        warningType:
          warning.cardType ||
          warning.warningType ||
          warning.type ||
          "إنذار عام",
        date:
          warning.date ||
          warning.createdAt ||
          new Date().toLocaleDateString("ar-SA"),
        // Add any additional fields from API
        matchId: warning.matchId,
        minute: warning.minute,
        reason: warning.reason,
      };

      // If targetCategory is specified, add all data to that category
      if (targetCategory) {
        const categoryName = urlToCategory[targetCategory];
        if (categoryName && organizedData[categoryName]) {
          organizedData[categoryName].push(mappedWarning);
        }
      } else {
        // Original logic for when no target category is specified
        let ageCategory = "فئة 16 سنة"; // Default category

        if (warning.ageCategory) {
          ageCategory = warning.ageCategory;
        } else if (warning.age) {
          const age = parseInt(warning.age);
          if (age <= 12) {
            ageCategory = "فئة 12 سنة";
          } else if (age <= 14) {
            ageCategory = "فئة 14 سنة";
          } else {
            ageCategory = "فئة 16 سنة";
          }
        } else if (warning.category) {
          ageCategory = warning.category;
        }
        // Add to appropriate category
        if (organizedData[ageCategory]) {
          organizedData[ageCategory].push(mappedWarning);
        } else {
          organizedData["فئة 16 سنة"]?.push(mappedWarning);
        }
      }
    });

    return organizedData;
  };
  
  const getWarningTypeColor = (type) => {
    switch (type) {
      case "سلوك غير رياضي":
        return "warning-yellow";
      case "عدم احترام الحكم":
        return "warning-red";
      case "تأخير اللعب":
        return "warning-blue";
      case "سلوك عدواني":
        return "warning-red";
      case "مخالفة قانونية":
        return "warning-red";
      case "عدم الانضباط":
        return "warning-orange";
      default:
        return "warning-gray";
    }
  };

  if (isLoading) {
    return (
      <div className="warning-report-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل كشف الإنذارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="warning-report-page">
      {/* Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="page-title">كشف الإنذارات</h1>
            <p className="page-subtitle">
              عرض وإدارة إنذارات اللاعبين حسب الفئات العمرية
            </p>
          </div>
          <button
            onClick={() => {
              const currentAge = searchParams.get("age");
              fetchWarningsData(currentAge);
            }}
            disabled={isLoading}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              fontSize: "14px",
            }}
          >
            {isLoading ? "جاري التحميل..." : "تحديث البيانات"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="error-container"
            style={{
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px",
              margin: "16px 0",
              color: "#dc2626",
            }}
          >
            <p>{error}</p>
            <button
              onClick={() => {
                const currentAge = searchParams.get("age");
                fetchWarningsData(currentAge);
              }}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>

      {/* Age Categories Container */}
      <div className="warnings-categories-container">
        <h2 className="categories-title">اختر الفئة العمرية</h2>
        <div className="categories-grid">
          {Object.entries(warningsData).map(([category, warnings], index) => {
            const colors = ["#3b82f6", "#10b981", "#f59e0b"];
            const icons = ["🏃‍♂️", "⚽", "🏆"];
            const totalWarnings = hasDataLoaded ? warnings.reduce((sum, warning) => sum + warning.totalCards, 0) : 0;
            const totalYellowCards = hasDataLoaded ? warnings.reduce((sum, warning) => sum + warning.yellowCards, 0) : 0;
            const totalRedCards = hasDataLoaded ? warnings.reduce((sum, warning) => sum + warning.redCards, 0) : 0;
            return (
              <div
                key={category}
                className={`category-card ${
                  selectedCategory === category ? "selected" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
                style={{ borderColor: colors[index] }}
              >
                <div className="category-icon" style={{ color: colors[index] }}>
                  {icons[index]}
                </div>
                <h3 className="category-name">{category}</h3>
                <div className="warnings-count">
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-number">{totalYellowCards}</span>
                      <span className="stat-text">🟨 صفراء</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{totalRedCards}</span>
                      <span className="stat-text">🟥 حمراء</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{totalWarnings}</span>
                      <span className="stat-text">المجموع</span>
                    </div>
                  </div>
                </div>
                {hasDataLoaded && warnings.length > 0 && (
                  <div className="last-warning">
                    أعلى مخالف: {warnings.reduce((prev, current) => 
                      prev.totalCards > current.totalCards ? prev : current).playerName}
                  </div>
                )}
                {!hasDataLoaded && (
                  <div
                    className="last-warning"
                    style={{ color: "#666", fontStyle: "italic" }}
                  >
                    اضغط لعرض الإنذارات
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Table */}
      {selectedCategory && (
        <div className="warnings-table-container">
          <div className="table-header">
            <h3>تفاصيل إنذارات {selectedCategory}</h3>
            <button
              className="close-button"
              onClick={() => setSelectedCategory(null)}
            >
              إغلاق
            </button>
          </div>

          {warningsData[selectedCategory].length === 0 ? (
            <div className="no-data">
              <div className="no-data-icon">⚠️</div>
              <p>لا توجد إنذارات في هذه الفئة</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="warnings-table">
                <thead>
                  <tr>
                    <th>اسم اللاعب</th>
                    <th>الأكاديمية</th>
                    <th>البطاقات الصفراء</th>
                    <th>البطاقات الحمراء</th>
                    <th>المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {warningsData[selectedCategory]
                    .sort((a, b) => b.totalCards - a.totalCards)
                    .map((warning) => (
                    <tr key={warning.id}>
                      <td>
                        <div className="player-info">
                          <div className="player-avatar">
                            {warning.playerName.charAt(0)}
                          </div>
                          <span>{warning.playerName}</span>
                        </div>
                      </td>
                      <td>{warning.academyName}</td>
                      <td>
                        <div className="cards-cell">
                          <span className="cards-number">{warning.yellowCards}</span>
                          <span className="cards-icon">🟨</span>
                        </div>
                      </td>
                      <td>
                        <div className="cards-cell">
                          <span className="cards-number">{warning.redCards}</span>
                          <span className="cards-icon">🟥</span>
                        </div>
                      </td>
                      <td>
                        <div className="total-cards-cell">
                          <span className="total-number">{warning.totalCards}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WarningReportPublic;
