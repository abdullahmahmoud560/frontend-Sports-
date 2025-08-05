import React, { useEffect, useState } from "react";
import "./MangeShedulde.css";
import axios from "axios";

const MangeShedulde = () => {
  const [matches, setMatches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("U12");
  
  // Categories data
  const categories = [
    { id: "U12", label: "فئة 12", age: "تحت 12 سنة", icon: "🏃‍♂️" },
    { id: "U14", label: "فئة 14", age: "تحت 14 سنة", icon: "⚽" },
    { id: "U16", label: "فئة 16", age: "تحت 16 سنة", icon: "🏆" },
  ];

  const getMatches = async (ageCategory = selectedCategory) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Matches/${ageCategory}`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    getMatches(categoryId);
  };
  useEffect(() => {
    getMatches();
  }, []);
  return (
    <div className="schedule-page" dir="rtl">
      {/* Header */}
      <div className="schedule-header">
        <div>
          <h2 className="schedule-title">
            <span role="img" aria-label="cup">
              🏆
            </span>{" "}
            إدارة المباريات
          </h2>
          <p className="schedule-desc">عرض وإدارة جميع مباريات البطولة</p>
        </div>
        <div className="schedule-filters">
          <button className="refresh-btn" onClick={() => getMatches(selectedCategory)}>
            تحديث <span className="refresh-icon">⟳</span>
          </button>
          <select className="filter-select">
            <option>جميع الحالات</option>
          </select>
          <select className="filter-select">
            <option>جميع الفئات</option>
          </select>
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
      {/* Matches List */}
      {matches.map((match) => (
      <div className="matches-list">
        <div className="match-card match-card--active">
          
            <div>
            <div className="match-status">
              <span className="status-badge status-badge--active">
                {match.matchStatus}
              </span>
            </div>
          <div className="match-info">
            <div className="match-title">
              {match.homeTeam} vs {match.awayTeam}
            </div>
            <div className="match-details">
              <span className="match-location">
                <span className="icon">📍</span> {match.stadium}
              </span>
              <span className="match-time">
                  <span className="icon">⏰</span> {match.time}
              </span>
              <span className="match-date">
                <span className="icon">�</span> {match.date}
              </span>
            </div>
          </div>
          </div>
          
        </div>
      </div>
      ))}
    </div>
  );
};

export default MangeShedulde;
