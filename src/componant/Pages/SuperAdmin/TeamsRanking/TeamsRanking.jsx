import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeamsRanking.css";

export default function TeamsRanking() {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("U12");
  // Categories data
  const categories = [
    { id: "U12", label: "فئة 12", age: "تحت 12 سنة", icon: "🏃‍♂️" },
    { id: "U14", label: "فئة 14", age: "تحت 14 سنة", icon: "⚽" },
    { id: "U16", label: "فئة 16", age: "تحت 16 سنة", icon: "🏆" },
  ];
  // Fetch teams data from API
  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/Matches-Table/${selectedCategory}`
        );
        // Sort teams by points (highest first)
        const sortedData = response.data.sort((a, b) => b.points - a.points);
        setTeamsData(sortedData);
        setError(null);
      } catch (err) {
        setError("فشل في تحميل البيانات");
        console.error("Error fetching teams data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, [selectedCategory]);

  // Function to get rank badge style
  const getRankBadgeStyle = (index) => {
    if (index === 0) return "rank-1";
    if (index === 1) return "rank-2";
    if (index === 2) return "rank-3";
    return "rank-other";
  };

  // Function to handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setTeamsData([]);
    setLoading(true);
    setError(null);
  };

  // Function to refresh data
  const refreshData = () => {
    setTeamsData([]);
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const fetchTeamsData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/Matches-Table/${selectedCategory}`
          );
          const sortedData = response.data.sort((a, b) => b.points - a.points);
          setTeamsData(sortedData);
        } catch (err) {
          setError("فشل في تحميل البيانات");
        } finally {
          setLoading(false);
        }
      };
      fetchTeamsData();
    }, 500);
  };

  if (loading) {
    return (
      <div className="public-teams-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>جاري تحميل جدول الترتيب...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-teams-page">
        <div className="error-container">
          <h2>خطأ في تحميل البيانات</h2>
          <p>{error}</p>
          <button onClick={refreshData} className="btn btn-primary">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-teams-page" dir="rtl">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">🏆 جدول ترتيب الفرق</h1>
            <p className="page-subtitle">
              ترتيب الأكاديميات حسب النقاط والأداء
            </p>
          </div>
          <button onClick={refreshData} className="refresh-btn">
            <svg
              className="refresh-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            تحديث البيانات
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2 className="categories-title">🎯 اختر الفئة العمرية</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-content">
                <h3 className="category-label">{category.label}</h3>
                <p className="category-age">{category.age}</p>
              </div>
              <div className="category-indicator">
                {selectedCategory === category.id && (
                  <div className="active-indicator">
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Teams Showcase */}
      {teamsData.length >= 3 && (
        <div className="top-teams-showcase">
          <h2 className="showcase-title">
            🥇 أفضل 3 أكاديميات - {categories.find(cat => cat.id === selectedCategory)?.label}
          </h2>
          <div className="top-teams-podium">
            {teamsData.slice(0, 3).map((team, index) => (
              <div
                key={team.academyName}
                className={`podium-card ${getRankBadgeStyle(index)}`}
              >
                <div className="podium-rank">{index + 1}</div>
                <div className="podium-content">
                  <h3 className="podium-team-name">{team.academyName}</h3>
                  <div className="podium-stats">
                    <div className="podium-stat">
                      <span className="stat-value">{team.points}</span>
                      <span className="stat-label">نقطة</span>
                    </div>
                    <div className="podium-stat">
                      <span className="stat-value">{team.wins}</span>
                      <span className="stat-label">فوز</span>
                    </div>
                    <div className="podium-stat">
                      <span className="stat-value">
                        {team.goalDifference > 0 ? "+" : ""}
                        {team.goalDifference}
                      </span>
                      <span className="stat-label">فارق الأهداف</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Table */}
      <div className="teams-table-section">
        <div className="table-header">
          <h2 className="table-title">
            📊 الجدول الكامل - {categories.find(cat => cat.id === selectedCategory)?.label}
          </h2>
          <div className="table-stats">
            <span className="total-teams">
              إجمالي الفرق: {teamsData.length}
            </span>
          </div>
        </div>

        <div className="table-container">
          <div className="responsive-table">
            <table className="teams-table">
              <thead>
                <tr>
                  <th className="rank-header">#</th>
                  <th className="team-header">الفريق</th>
                  <th className="stat-header">لعب</th>
                  <th className="stat-header">فوز</th>
                  <th className="stat-header">تعادل</th>
                  <th className="stat-header">خسارة</th>
                  <th className="stat-header">له</th>
                  <th className="stat-header">عليه</th>
                  <th className="stat-header">+/-</th>
                  <th className="points-header">النقاط</th>
                </tr>
              </thead>
              <tbody>
                {teamsData.map((team, index) => (
                  <tr
                    key={team.academyName}
                    className={`table-row ${getRankBadgeStyle(index)}`}
                  >
                    <td className="rank-cell">
                      <div className="rank-badge-small">{index + 1}</div>
                    </td>
                    <td className="team-cell">
                      <div className="team-info">
                        <span className="team-name">{team.academyName}</span>
                      </div>
                    </td>
                    <td className="stat-cell">{team.matchesPlayed}</td>
                    <td className="stat-cell wins">{team.wins}</td>
                    <td className="stat-cell draws">{team.draws}</td>
                    <td className="stat-cell losses">{team.losses}</td>
                    <td className="stat-cell goals-for">{team.goalsFor}</td>
                    <td className="stat-cell goals-against">
                      {team.goalsAgainst}
                    </td>
                    <td
                      className={`stat-cell goal-diff ${
                        team.goalDifference >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {team.goalDifference > 0 ? "+" : ""}
                      {team.goalDifference}
                    </td>
                    <td className="points-cell">
                      <div className="points-badge">{team.points}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="stats-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">⚽</div>
            <div className="summary-content">
              <span className="summary-value">
                {teamsData.reduce((sum, team) => sum + team.goalsFor, 0)}
              </span>
              <span className="summary-label">إجمالي الأهداف</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🏟️</div>
            <div className="summary-content">
              <span className="summary-value">
                {teamsData.reduce((sum, team) => sum + team.matchesPlayed, 0)}
              </span>
              <span className="summary-label">إجمالي المباريات</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🏆</div>
            <div className="summary-content">
              <span className="summary-value">
                {teamsData.reduce((sum, team) => sum + team.wins, 0)}
              </span>
              <span className="summary-label">إجمالي الانتصارات</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🤝</div>
            <div className="summary-content">
              <span className="summary-value">
                {teamsData.reduce((sum, team) => sum + team.draws, 0)}
              </span>
              <span className="summary-label">إجمالي التعادلات</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
